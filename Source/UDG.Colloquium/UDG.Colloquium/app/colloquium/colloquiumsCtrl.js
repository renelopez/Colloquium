(function () {
    'use strict';

    var controllerId = 'colloquiumsCtrl';

    angular.module('app').controller(controllerId,
        ['$location','common','config','datacontext', colloquiumsCtrl]);

    function colloquiumsCtrl($location,common,config,datacontext) {
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var keyCodes = config.keyCodes;

        var applyFilter = function() {};

        vm.colloquiums = [];
        vm.colloquiumsSearch = '';
        vm.colloquiumsFilter = colloquiumsFilter;
        vm.editColloquium = editColloquium;
        vm.filteredColloquiums = [];
        vm.goToColloquiumSessions = goToColloquiumSessions;
        vm.title = 'Colloquiums';
        vm.refresh = refresh;
        vm.search = search;
        
        activate();

        function activate() {
            toggleBusyMessage(true);
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
                $location.path('/colloquiums/' + col.id);
            }
        }
        
        function getColloquiums(forceRefresh) {
            return datacontext.colloquium.getAll(forceRefresh).then(function(cols) {
                vm.colloquiums = vm.filteredColloquiums = cols;
            });
        }
        
        function goToColloquiumSessions(col) {
            if (col && col.id) {
                $location.path('/colloquiums/' + col.id + '/sessions');
            }
        }
        
        function refresh() {
            getColloquiums(true);
        }
        
        function search($event) {
            if ($event.keyCode === keyCodes.esc) {
                vm.colloquiumsSearch = '';
                applyFilter(true);
            } else {
                applyFilter();
            }
        }
        
        function toggleBusyMessage(state) {
            common.$broadcast(config.events.spinnerToggle, { show: state });
        }
    }
})();
