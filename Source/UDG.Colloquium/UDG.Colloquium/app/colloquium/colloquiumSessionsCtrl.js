(function () {
    'use strict';

    var controllerId = 'colloquiumSessionsCtrl';

    angular.module('app').controller(controllerId,
        ['$state','$stateParams','$window', 'common', 'config', 'datacontext', colloquiumSessionsCtrl]);

    function colloquiumSessionsCtrl($state,$stateParams,$window, common, config, datacontext) {
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var keyCodes = config.keyCodes;

        var applyFilter = function () { };
        vm.colloquiumId = $stateParams.colloquiumId;
        vm.colloquiumSessions = [];
        vm.colloquiumSessionsCount = 0;
        vm.colloquiumSessionsFilteredCount = 0;
        vm.colloquiumSessionsSearch = '';
        vm.colloquiumSessionsFilter = colloquiumSessionsFilter;
        vm.currentColloquium = {};
        vm.editSession = editSession;
        vm.filteredColloquiumSessions = [];
        vm.goBack = goBack;
        vm.pageChanged = pageChanged;
        vm.paging = {
            currentPage: 1,
            maxPagesToShow: 5,
            pageSize:2
        };
        vm.refresh = refresh;
        vm.search = search;
        vm.title = 'Sessions';

        Object.defineProperty(vm.paging, 'pageCount', {
            get:function() {
                return Math.floor(vm.colloquiumSessionsFilteredCount / vm.paging.pageSize) + 1;
            }
        });

        activate();
        
        function activate() {
            common.toggleBusyMessage(true);
            common.activateController([getRequestedColloquiumSessions(),getCurrentColloquium()], controllerId).then(function() {
                applyFilter = common.createSearchThrottle(vm, 'colloquiumSessions',"filteredColloquiumSessions","colloquiumSessionsFilter");
                if (vm.colloquiumSessionsSearch) {
                    applyFilter(true);
                }
                log('Activated ColloquiumSessions View');
            });
        }
        
        function editSession(session) {
            if (session && session.id) {
                $state.go('colloquiumSessionDetail', { colloquiumId: vm.colloquiumId, sessionId: session.id });
            }
        }
        
        function getColloquiumSessionsCount() {
            return datacontext.colloquium.getColloquiumSessionsCount(vm.colloquiumId).then(function(data) {
                return vm.colloquiumSessionsCount = data;
            });
        }

        function getColloquiumSessionsFilteredCount() {
            return datacontext.colloquium.getColloquiumSessionsFilteredCount(vm.colloquiumId,vm.colloquiumSessionsSearch).then(function (data) {
                return vm.colloquiumSessionsFilteredCount = data;
            });
        }

        function colloquiumSessionsFilter(session) {
            var textContains = common.textContains;
            var searchText = vm.colloquiumSessionsSearch;
            var isMatch = searchText ? textContains(session.name, searchText) : true;
            return isMatch;
        }

        function getCurrentColloquium(forceRemote) {
            return datacontext.colloquium.getById(vm.colloquiumId, forceRemote).then(function(colloquium) {
                vm.currentColloquium = colloquium;
            });
        }
        
        function getRequestedColloquiumSessions(forceRefresh) {
            return datacontext.colloquium.getSessionsByColloquiumId(vm.colloquiumId, vm.paging.currentPage, vm.paging.pageSize, vm.colloquiumSessionsSearch,vm.forceRefresh).then(function (sessions) {
                vm.colloquiumSessions = vm.filteredColloquiumSessions = sessions;
                getColloquiumSessionsFilteredCount();
                if (!vm.colloquiumSessionsCount && forceRefresh) {
                    getColloquiumSessionsCount();
                }
                return sessions;
            });
        }

        function goBack() {
            $window.history.back();
        }

        function pageChanged() {
            if (!vm.paging.currentPage) {
                return;
            }
            getRequestedColloquiumSessions();
        }
        
        function refresh() {
            getRequestedColloquiumSessions(true);
        }

        function search($event) {
            if ($event.keyCode === keyCodes.esc) {
                vm.colloquiumSessionsSearch = '';
                applyFilter(true);
            } else {
                applyFilter();
            }
            getRequestedColloquiumSessions();
        }
    }
})();
