(function () {
    'use strict';

    var controllerId = 'roleMgmtCtrl';
    angular
        .module('app')
        .controller(controllerId, roleMgmtCtrl);

    roleMgmtCtrl.$inject = ['$modal','$state','bootstrap.dialog','common','config','datacontext']; 

    function roleMgmtCtrl($modal,$state,bsDialog,common,config,datacontext) {
        /* jshint validthis:true */
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logInfo = getLogFn(controllerId, "info");
        var logSuccess = getLogFn(controllerId, 'success');
        var logError = getLogFn(controllerId, 'error');
        var keyCodes = config.keyCodes;


        var applyFilter = function () { };
        var vm = this;


        vm.deleteRole = deleteRole;
        vm.editRole = editRole;
        vm.title = 'Roles already available in the system';
        vm.filteredRoles = [];
        vm.refresh = refresh;
        vm.search = search;
        vm.rolesFilter = rolesFilter;
        vm.roles = [];
        vm.rolesSearch = undefined;
        vm.workingRole = undefined;
        activate();

        function activate() {
            common.toggleBusyMessage(true);
            common.activateController([getRoles()], controllerId).then(function () {
                applyFilter = common.createSearchThrottle(vm, 'roles');
                if (vm.rolesSearch) {
                    applyFilter(true);
                }
                log("Activated Role Management View");
            });
        }
        function getRoles(forceRemote) {
            return datacontext.role.getAll(forceRemote).then(function (roles) {
                vm.roles = vm.filteredRoles = roles;
            });
        }

        function rolesFilter(role) {
            var textContains = common.textContains;
            var searchText = vm.rolesSearch;
            var isMatch = searchText ? textContains(role.name, searchText) : true;
            return isMatch;
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

        function cancel() {
            datacontext.cancel();
            if (vm.workingRole.entityAspect.entityState.isDetached()) {
                refresh();
            }
        }

        function deleteRole(role) {
            vm.workingRole = role;
            return bsDialog.deleteDialog('Role').then(confirmDelete);

            function confirmDelete() {
                vm.workingRole.isActive = false;
                save().then(success, failed);

                function success() {
                    logSuccess("The following role was deleted:" + role.name + ".");
                    refresh();
                }

                function failed(error) {
                    logError("Following errors ocurred:", error, true);
                    cancel();
                }

            }
        }

        function editRole(role) {
            $state.go('roleDetail', { roleId: role.id });
        }

        function refresh() {
            getRoles(true);
        }

        function search($event) {
            if ($event.keyCode === keyCodes.esc) {
                vm.rolesSearch = '';
                applyFilter(true);
            } else {
                applyFilter();
            }
        }
    }
})();
