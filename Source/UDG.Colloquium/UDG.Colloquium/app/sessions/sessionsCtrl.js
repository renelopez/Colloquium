(function () {
    'use strict';

    var controllerId = 'sessionsCtrl';

    angular.module('app').controller(controllerId,
        ['bootstrap.dialog','$state','$window', 'common', 'config', 'datacontext', sessionsCtrl]);

    function sessionsCtrl(bsDialog,$state, $window, common, config, datacontext) {
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logInfo = getLogFn(controllerId, "info");
        var logSuccess = getLogFn(controllerId, 'success');
        var logError = getLogFn(controllerId, 'error');
        var keyCodes = config.keyCodes;

        var applyFilter = function () { };
        vm.checkComments=checkComments;
        vm.sessions = [];
        vm.sessionsCount = 0;
        vm.sessionsFilteredCount = 0;
        vm.sessionsSearch = '';
        vm.sessionsFilter = sessionsFilter;
        vm.currentSession = {};
        vm.deleteSession = deleteSession;
        vm.editSession = editSession;
        vm.filteredSessions = [];
        vm.goBack = goBack;
        vm.pageChanged = pageChanged;
        vm.paging = {
            currentPage: 1,
            maxPagesToShow: 10,
            pageSize:4
        };
        vm.refresh = refresh;
        vm.search = search;
        vm.title = 'Sessions';

        Object.defineProperty(vm.paging, 'pageCount', {
            get:function() {
                return Math.floor(vm.sessionsFilteredCount / vm.paging.pageSize) + 1;
            }
        });

        activate();
        
        function activate() {
            common.toggleBusyMessage(true);
            common.activateController([getSessions()], controllerId).then(function() {
                applyFilter = common.createSearchThrottle(vm, 'sessions',"filteredSessions","sessionsFilter");
                if (vm.sessionsSearch) {
                    applyFilter(true);
                }
                log('Activated ColloquiumSessions View');
            });
        }

        function checkComments(session) {
            $state.go('sessionComments', { sessionId: session.id });
        }

        function deleteSession(session) {
            vm.workingSession = session;
            return bsDialog.deleteDialog('Session').then(confirmDelete);

            function confirmDelete() {
                session.isActive = false;
                save().then(success, failed);

                function success() {
                    logSuccess("The following session was deleted:" + session.name + ".");
                    refresh();
                }

                function failed(error) {
                    logError("Following errors ocurred:", error, true);
                    cancel();
                }

            }
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
        
        function editSession(session) {
            if (session && session.id) {
                $state.go('sessionDetail', { sessionId: session.id });
            }
        }
        
        function getSessionsCount() {
            return datacontext.session.getSessionsCount().then(function(data) {
                return vm.sessionsCount = data;
            });
        }

        function getSessionsFilteredCount() {
            return datacontext.session.getSessionsFilteredCount(vm.sessionsSearch).then(function (data) {
                return vm.sessionsFilteredCount = data;
            });
        }

        function sessionsFilter(session) {
            var textContains = common.textContains;
            var searchText = vm.sessionsSearch;
            var isMatch = searchText ? textContains(session.name, searchText) : true;
            return isMatch;
        }

        
        function getSessions(forceRefresh) {
            return datacontext.session.getAll(vm.paging.currentPage, vm.paging.pageSize, vm.sessionsSearch,vm.forceRefresh).then(function (sessions) {
                vm.sessions = vm.filteredSessions = sessions;
                getSessionsFilteredCount();
                if (!vm.sessionsCount && forceRefresh) {
                    getSessionsCount();
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
            getSessions();
        }
        
        function refresh() {
            getSessions(true);
        }

        function search($event) {
            if ($event.keyCode === keyCodes.esc) {
                vm.colloquiumSessionsSearch = '';
                applyFilter(true);
            } else {
                applyFilter();
            }
            getSessions();
        }
    }
})();
