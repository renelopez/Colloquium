(function () {
    'use strict';

    var controllerId = 'usrMgmtCtrl';
    angular
        .module('app')
        .controller(controllerId, usrMgmtCtrl);

    usrMgmtCtrl.$inject = ['$location','$state','common','config','datacontext']; 

    function usrMgmtCtrl($location,$state,common,config,datacontext) {
        /* jshint validthis:true */
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logInfo = getLogFn(controllerId, "info");
        var logSuccess = getLogFn(controllerId, 'success');
        var logError = getLogFn(controllerId, 'error');
        var keyCodes = config.keyCodes;

        var applyFilter = function() {};
        var vm = this;


        vm.deleteUser = deleteUser;
        vm.editRolesForUser = editRolesForUser;
        vm.editUser = editUser;
        vm.title = 'Users already available in the system';
        vm.filteredUsers = [];
        vm.refresh = refresh;
        vm.pageChanged = pageChanged;
        vm.paging= {
            currentPage: 1,
            maxPagesToShow: 10,
            pageSize:3
        }
        vm.usersFilteredCount = 0;
        vm.usersCount = 0;
        vm.search = search;
        vm.usersFilter = usersFilter;
        vm.users = [];
        vm.usersSearch = '';




        activate();

        function activate() {
            common.toggleBusyMessage(true);
            common.activateController([getUsers()], controllerId).then(function () {
                applyFilter = common.createSearchThrottle(vm, 'users');
                if (vm.usersSearch) {
                    applyFilter(true);
                }
                log("Activated User Management View");
            });
        }

        function getUsers(forceRemote) {
            return datacontext.user.getAll(vm.paging.currentPage,vm.paging.pageSize,vm.usersSearch,forceRemote).then(function(users) {
                vm.users = vm.filteredUsers = users;
                getUsersFilteredCount();
                if (!vm.usersFilteredCount && forceRemote) {
                    getUsersCount();
                }
            });
        }

        function getUsersCount() {
            return datacontext.user.getCount().then(function(userCount) {
                vm.usersCount = userCount;
            });
        }

        function getUsersFilteredCount() {
            return datacontext.user.getFilteredCount().then(function (userCount) {
               vm.usersFilteredCount = userCount;
            });
        }

        function usersFilter(user) {
            var textContains = common.textContains;
            var searchText = vm.usersSearch;
            var isMatch = searchText ? textContains(user.userName, searchText) : true;
            return isMatch;
        }

        function deleteUser(user) {
            
        }

        function editRolesForUser(user) {
            $state.go('userRoles', { userId: user.id });
        }

        function editUser(user) {
            $state.go('edit.credentials', { userId: user.id });
        }

        function pageChanged() {
            if (!vm.paging.currentPage) {
                return;
            }
            getUsers();
        }

        function refresh() {
            getUsers(true);
        }

        function search($event) {
            if ($event.keyCode === keyCodes.esc) {
                vm.usersSearch = '';
                applyFilter(true);
            } else {
                applyFilter();
            }
        }
    }
})();
