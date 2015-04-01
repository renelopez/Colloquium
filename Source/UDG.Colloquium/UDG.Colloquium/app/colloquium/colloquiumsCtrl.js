(function () {
    'use strict';

    var controllerId = 'colloquiumsCtrl';

    angular.module('app').controller(controllerId,
        ['$state','bootstrap.dialog','common','config','datacontext', colloquiumsCtrl]);

    function colloquiumsCtrl($state,bsDialog,common,config,datacontext) {
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logInfo = getLogFn(controllerId, "info");
        var logSuccess = getLogFn(controllerId, 'success');
        var logError = getLogFn(controllerId, 'error');

        var keyCodes = config.keyCodes;

        var applyFilter = function() {};

        vm.colloquiums = [];
        vm.colloquiumsCount = 0;
        vm.colloquiumsFilteredCount = 0;

        vm.colloquiumsSearch = '';
        vm.colloquiumsFilter = colloquiumsFilter;
        vm.deleteColloquium = deleteColloquium;
        vm.editColloquium = editColloquium;
        vm.filteredColloquiums = [];
        vm.pageChanged = pageChanged;
        vm.paging= {
            currentPage: 1,
            maxPagesToShow: 10,
            pageSize:2
        }
        vm.goToColloquiumSessions = goToColloquiumSessions;
        vm.title = 'Colloquiums';
        vm.refresh = refresh;
        vm.search = search;
        vm.workingColloquium = undefined;

        Object.defineProperty(vm.paging,'pageCount', {
            get:function() {
                return Math.floor(this.colloquiumsFilteredCount / vm.paging.pageSize) + 1;
            }
        });
        
        activate();

        function activate() {
            common.toggleBusyMessage(true);
            common.activateController([getColloquiums()], controllerId).then(function() {
                applyFilter = common.createSearchThrottle(vm, 'colloquiums');
                if (vm.colloquiumsSearch) {
                    applyFilter(true);
                }
                log('Activated Colloquium View');
            });
        }
        
        function colloquiumsFilter(colloquium) {
            var textContains = common.textContains;
            var searchText = vm.colloquiumsSearch;
            var isMatch = searchText ? textContains(colloquium.period, searchText) : true;
            return isMatch;
        }
        
        function editColloquium(col) {
            if (col && col.id) {
                $state.go("colloquiumDetail", { colloquiumId: col.id });
            }
        }

        function deleteColloquium(col) {
            vm.workingColloquium = col;
            return bsDialog.deleteDialog('Colloquium').then(confirmDelete);

            function confirmDelete() {
                //datacontext.markDeleted(col);
                col.isActive = false;
                save().then(success, failed);

                function success() {
                    logSuccess("The following colloquium was deleted:" + col.name + ".");
                    refresh();
                }

                function failed(error) {
                    logError("Following errors ocurred:", error, true);
                    cancel();
                }

            }
        }
        
        function getColloquiums(forceRefresh) {
            return datacontext.colloquium.getAll(vm.paging.currentPage, vm.paging.pageSize, vm.colloquiumsSearch, forceRefresh).then(function (cols) {
                vm.colloquiums = vm.filteredColloquiums = cols;
                getColloquiumsFilteredCount();
                if (!vm.colloquiumsFilteredCount && forceRefresh) {
                    getColloquiumsCount();
                }
            });
        }

        function getColloquiumsFilteredCount() {
            return datacontext.colloquium.getColloquiumsFilteredCount(vm.colloquiumsSearch).then(function(count) {
                vm.colloquiumsFilteredCount = count;
            });
        }

        function getColloquiumsCount() {
            return datacontext.colloquium.getColloquiumsCount().then(function (count) {
                vm.colloquiumsCount = count;
            });
        }
        
        function goToColloquiumSessions(col) {
            if (col && col.id) {
                $state.go('colloquiumSessions', { colloquiumId: col.id });
            }
        }

        function pageChanged() {
            if (!vm.paging.currentPage) {
                return;
            }
            getColloquiums();
        }
        
        function refresh() {
            getColloquiums(true);
        }
        
        function save() {
            common.toggleBusyMessage(true);
            return datacontext.saveChanges()
               .then(function (saveResult) {
                   common.toggleBusyMessage(false);
                   refresh();
               }, function (error) {
                   common.toggleBusyMessage(false);
                   refresh();
               });
        }

        function search($event) {
            if ($event.keyCode === keyCodes.esc) {
                vm.colloquiumsSearch = '';
                applyFilter(true);
            } else {
                applyFilter();
            }
            getColloquiums();
        }
    }
})();
