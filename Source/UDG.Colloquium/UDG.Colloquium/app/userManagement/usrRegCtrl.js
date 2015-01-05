(function () {
    'use strict';

    var controllerId = 'usrRegCtrl';

    angular.module('app').controller(controllerId,
        ['$location', '$stateParams', 'common', 'config', 'datacontext', 'lodash', usrRegCtrl]);

    function usrRegCtrl($location,$stateParams,common, config, datacontext,lodash) {
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
        vm.contactTypes = ['Home Phone', 'Address', 'Email', 'Work Phone', 'Web Page'];
        vm.genres = ['Male', 'Female'];
        vm.removeEntity = removeEntity;
        vm.removeContactToUser = removeContactToUser;
        vm.removeWorkToUser = removeWorkToUser;
        vm.roles = [];
        vm.setActiveTab = setActiveTab;
        vm.saveChanges = saveChanges;
        vm.toggleRoles = toggleRoles;
        vm.user = {};
        
        activate();
        
        function activate() {
            toggleBusyMessage(true);
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
        
        function createUser() {
            vm.user = datacontext.user.create();
        }
        
        function findUserById(id) {
            toggleBusyMessage(true);
            return datacontext.user.getById(id).then(function (user) {
                toggleBusyMessage(false);
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
            common.$broadcast(config.events.spinnerToggle, { show: true });
            datacontext.saveChanges().then(success).catch(errorSave);
            
            function success() {
                common.$broadcast(config.events.spinnerToggle, { show: false });
                logSuccess("User " + vm.user.userName + " was succesfully created");
                $location.path('/');
            }
            
            function errorSave(error) {
                common.$broadcast(config.events.spinnerToggle, { show: false });
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
        
        function toggleBusyMessage(state) {
            common.$broadcast(config.events.spinnerToggle, { show: state });
        }
    }
})();
