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
        vm.colloquiumSessionsSearch = '';
        vm.colloquiumSessionsFilter = colloquiumSessionsFilter;
        vm.editSession = editSession;
        vm.filteredColloquiumSessions = [];
        vm.goBack = goBack;
        vm.refresh = refresh;
        vm.search = search;
        vm.title = 'Sessions';
        vm.currentColloquium = {};

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
                $state.go('colloquiumSessionDetails', { colloquiumId: vm.colloquiumId, sessionId: session.id });
            }
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
            return datacontext.colloquium.getSessionsByColloquiumId(vm.colloquiumId,forceRefresh).then(function(sessions) {
                vm.colloquiumSessions = vm.filteredColloquiumSessions = sessions;
            });
        }

        function goBack() {
            $window.history.back();
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
        }
    }
})();
