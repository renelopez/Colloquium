(function () {
    'use strict';

    var controllerId = 'usrRoleDetailCtrl';
    angular
        .module('app')
        .controller(controllerId, usrRoleDetailCtrl);

    usrRoleDetailCtrl.$inject = ['$location','$scope','$window','$stateParams','$state','common','config','datacontext','lodash']; 

    function usrRoleDetailCtrl($location,$scope,$window,$stateParams,$state, common, config, datacontext,lodash) {
        /* jshint validthis:true */
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logInfo = getLogFn(controllerId, "info");
        var logSuccess = getLogFn(controllerId, 'success');
        var logError = getLogFn(controllerId, 'error');
        var userId = $stateParams.userId;

        var vm = this;
        vm.roles = [];
        
        vm.hasChanges = false;
        vm.isSaving = false;
        vm.canSave = canSave;
        vm.cancel = cancel;
        vm.save = save;

        vm.title = 'usrRoleDetailCtrl';

        Object.defineProperty(vm, 'canSave', {
            get: canSave
        });

        activate();

        function activate() {
            common.toggleBusyMessage(true);
            onDestroy();
            onHasChanges();
            common.activateController([getRoles()], controllerId).then(function () {
                log("Activated User Roles View");
                if (userId) {
                    getUserRolesById(userId);
                }
                // TODO Make error message here..
            });
        }

        function addOrRemoveRoles() {
            vm.roles.forEach(function(role) {
                if (!role.selected) {
                    var existingUserRole = lodash.find(vm.user.roles, function (userRole) {
                        return userRole.roleId === role.id;
                    });
                    if (existingUserRole) {
                        removeUserRole(role);
                    }
                } else {
                    var existingUserRole = lodash.find(vm.user.roles, function(userRole) {
                        return userRole.roleId === role.id;
                    });
                    if (!existingUserRole) {
                        addUserRole(role);
                    }
                }
            });
        }

        function getUserRolesById(id) {
            common.toggleBusyMessage(true);
            return datacontext.user.getUserRolesById(id).then(function (user) {
                common.toggleBusyMessage(false);
                vm.user = user;
                selectCurrentUserRoles();
                return vm.user;
            });
        }

        function addUserRole(role) {
            var userRoleToAdd = datacontext.urole.create(vm.user.id, role.id);
            vm.user.roles.push(userRoleToAdd);
        }

        function canSave() {
            return !vm.isSaving; //&& vm.hasChanges;
        }

        function getRoles() {
            return datacontext.role.getAll().then(function (roles) {
                vm.roles = roles;
            });
        }

        function onDestroy() {
            $scope.$on('$destroy', function () {
                datacontext.cancel();
            });
        }

        function onHasChanges() {
            $scope.$on(config.events.hasChangesChanged, function (event, data) {
                vm.hasChanges = data.hasChanges;
            });
        }

        function removeUserRole(role) {
            var userRoleToRemove = lodash.find(vm.user.roles, function (userRole) {
                return userRole.roleId === role.id;
            });

            datacontext.markDeleted(userRoleToRemove);

            lodash.remove(vm.user.roles, function (userRole) {
                return userRoleToRemove === userRole;
            });
        }

        function save() {
            if (!canSave()) { return $q.when(null); } // Must return a promise
            vm.isSaving = true;
            addOrRemoveRoles();
            datacontext.saveChanges().then(success).catch(errorSave);

            function success() {
                common.toggleBusyMessage(false);
                logSuccess("User " + vm.user.userName + " was succesfully created");
                $location.path('/');
            }

            function errorSave(error) {
                common.toggleBusyMessage(false);
                logError("Following errors ocurred:", error, true);
            }
        }

        function selectCurrentUserRoles() {
            vm.roles.forEach(function (role) {
                role.selected = false;
                var userRoleFound=lodash.find(vm.user.roles, function(userRole) {
                    return userRole.roleId === role.id;
                });
                if (userRoleFound) {
                    role.selected = true;
                }
            });
        }

        function cancel() {
            datacontext.cancel();
            if (vm.user.entityAspect.entityState.isDetached()) {
                goBack();
            }
        }

        function goBack() {
            $window.history.back();
        }
    }
})();
