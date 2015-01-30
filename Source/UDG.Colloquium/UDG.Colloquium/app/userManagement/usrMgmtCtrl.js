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
        vm.search = search;
        vm.usersFilter = usersFilter;
        vm.users = [];
        vm.usersSearch = undefined;



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
            return datacontext.user.getAll(forceRemote).then(function(users) {
                vm.users = vm.filteredUsers = users;
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
            //$location.path('/management/roles/users/' + user.id);
            $state.go('userRoles', { userId: user.id },{location:true});
        }

        function editUser(user) {
            $state.go('edit.credentials', { userId: user.id });
            //$location.path('/register/credentials/' + user.id);
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
