(function () {
    'use strict';

    var controllerId = 'usrRegCtrl';

    angular.module('app').controller(controllerId,
        ['$location','$scope', '$stateParams','$window', 'common', 'config', 'datacontext', 'lodash', usrRegCtrl]);

    function usrRegCtrl($location, $scope,$stateParams,$window,common, config, datacontext, lodash) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logInfo = getLogFn(controllerId, "info");
        var logSuccess = getLogFn(controllerId, 'success');
        var logError = getLogFn(controllerId, 'error');

        var vm = this;
        
        
       
        vm.activeTab = "";
        vm.addContactToUser = addContactToUser;
        vm.addWorkToUser = addWorkToUser;
        vm.adviceWorkMessage = "Please click to expand/collapse this section to add new work information";
        vm.adviceContactMessage = "Please click to expand/collapse this section to add new contact information";
        vm.cancel = cancel;
        vm.contactTypes = ['Home Phone', 'Address', 'Email', 'Work Phone', 'Web Page'];
        vm.goBack = goBack;
        vm.genres = ['Male', 'Female'];
        vm.hasChanges = false;
        vm.isSaving = false;
        vm.removeEntity = removeEntity;
        vm.removeContactToUser = removeContactToUser;
        vm.removeWorkToUser = removeWorkToUser;
        vm.roles = [];
        vm.setActiveTab = setActiveTab;
        vm.saveChanges = saveChanges;
        vm.toggleRoles = toggleRoles;
        vm.user = {};

        Object.defineProperty(vm, 'canSave', {
            get: canSave
        });
        
        activate();
        
        function activate() {
            common.toggleBusyMessage(true);
            onDestroy();
            onHasChanges();
            common.activateController([getRoles()], controllerId).then(function() {
                log("Activated Register View");
                if ($stateParams.userId) {
                    findUserById($stateParams.userId);
                } else {
                    createUser();
                }
                loadInitialTab();
            });
        }
        
        function addContactToUser() {
            var newContact = datacontext.contact.create();
            vm.user.contacts.push(newContact);
        }
        
        function addWorkToUser() {
            var newWork = datacontext.work.create();
            var newCompany = datacontext.company.create();
            newWork.company = newCompany;
            vm.user.works.push(newWork);
        }

        function goBack() {
            $window.history.back();
        }

        function cancel() {
            datacontext.cancel();
            if (vm.user.entityAspect.entityState.isDetached()) {
                goBack();
            }
        }

        function canSave() {
            return !vm.isSaving && vm.hasChanges;
        }
        
        function createUser() {
            vm.user = datacontext.user.create();
        }
        
        function findUserById(id) {
            common.toggleBusyMessage(true);
            return datacontext.user.getById(id).then(function (user) {
                common.toggleBusyMessage(false);
                return vm.user = user;
            });
        }
        
        function getRoles() {
            return datacontext.role.getAll().then(function(roles) {
                vm.roles = roles;
            });
        }
        
        function loadInitialTab() {
            var url = $location.url();
            vm.activeTab = url.split("/")[2];
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
        
        function removeContactToUser(contact) {
            removeEntity(contact);
            lodash.remove(vm.user.contacts, function (currentContact) {
                return currentContact === contact;
            });
        }
        
        function removeWorkToUser(work) {
            removeEntity(work.company);
            removeEntity(work);
            lodash.remove(vm.user.works, function (currentWork) {
                return currentWork === work;
            });
        }
        
        function removeEntity(entity) {
            datacontext.markDeleted(entity);
        }
        
        function saveChanges() {
            if (!canSave()) { return $q.when(null); } // Must return a promise
            vm.isSaving = true;
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
        
        
        
        function setActiveTab(value) {
            vm.activeTab = value;
        }
        
        function toggleRoles(role) {
            role.selected = !role.selected;
            
            if (!role.selected) {
                removeUserRole(role);
            } else {
                addUserRole(role);
            }
        }
        
        function addUserRole(role) {
            var newUserRole = datacontext.urole.create(vm.user.id, role.id);
            vm.user.roles.push(newUserRole);
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
    }
})();
