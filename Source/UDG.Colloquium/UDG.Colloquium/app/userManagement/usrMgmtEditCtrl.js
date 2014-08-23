(function () {
    'use strict';

    var controllerId = 'usrMgmtEditCtrl';

    angular.module('app').controller(controllerId,
        ['$location','$stateParams','common', 'config', 'usrMgmtDatacontextSvc', usrMgmtEditCtrl]);

    function usrMgmtEditCtrl($location, $stateParams,common, config, usrMgmtDatacontextSvc) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logInfo = getLogFn(controllerId, "info");
        var logSuccess = getLogFn(controllerId, 'success');
        var logError = getLogFn(controllerId, 'error');

        var vm = this;
        
        vm.contactTypes = ['Home Phone', 'Address', 'Email', 'Work Phone', 'Web Page'];
        vm.genres = ['Male','Female'];
        vm.activeTab = "";
        vm.setActiveTab = setActiveTab;
        vm.adviceWorkMessage = "Please click to expand/collapse this section to add new work information";
        vm.adviceContactMessage = "Please click to expand/collapse this section to add new contact information";
        vm.user = {};
        vm.roles = [];
        vm.selectedRoles = [];
        vm.toggleRoles = toggleRoles;
        activate();

        
        function activate() {
            common.activateController([usrMgmtDatacontextSvc.ready()], controllerId).then(function () {
                log("Activated Register View");
                vm.addContactToUser = addContactToUser;
                vm.addWorkToUser = addWorkToUser;
                vm.removeContactToUser = removeContactToUser;
                vm.removeWorkToUser = removeWorkToUser;
                vm.saveChanges = saveChanges;
                findUserById($stateParams.userId);
                fillRoles();
                fillOwnedRoles();
                loadInitialTab();
            }).catch(handleError);
            
            function handleError(error) {
                common.$broadcast(config.events.spinnerToggle, { show: false });
                logError("Following errors ocurred:", error, true);
            }
        }
        
        function addContactToUser() {
            usrMgmtDatacontextSvc.addContactToUser(vm.user);
        }
        
        function addWorkToUser() {
            usrMgmtDatacontextSvc.addWorkToUser(vm.user);
        }
        
        function fillOwnedRoles() {
            usrMgmtDatacontextSvc.getUserRoles(user).then(function(roles) {
                vm.selectedRoles = roles;
            });
        }

        function fillRoles() {
            usrMgmtDatacontextSvc.getRoles().then(function (roles) {
                vm.roles = roles;
            });
        }
        
        function findUserById(id) {
            common.$broadcast(config.events.spinnerToggle, { show: true });
            return usrMgmtDatacontextSvc.findUserById(id).then(function (user) {
                common.$broadcast(config.events.spinnerToggle, { show: false });
               return vm.user = user[0];
            });
        }
    

        function removeContactToUser(contact) {
            usrMgmtDatacontextSvc.removeContactToUser(contact);
        }

        function removeWorkToUser(work) {
            usrMgmtDatacontextSvc.removeWorkToUser(work);
        }
        
        function saveChanges() {
            common.$broadcast(config.events.spinnerToggle, { show: true });
            usrMgmtDatacontextSvc.saveChanges().then(success).catch(errorSave);
            
            
            function success() {
                common.$broadcast(config.events.spinnerToggle, { show: false });
                logSuccess("User "+vm.user.userName+" was succesfully created");
            }
            
            function errorSave(error) {
                common.$broadcast(config.events.spinnerToggle, { show: false });
                logError("Following errors ocurred:", error, true);
            }
        }
        
        function loadInitialTab() {
            var url = $location.url();
            vm.activeTab = url.split("/")[3];
        }
        
        function setActiveTab(value) {
            vm.activeTab = value;
        }
    }
})();
