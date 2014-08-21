(function () {
    'use strict';

    var controllerId = 'usrMgmtRegCtrl';

    angular.module('app').controller(controllerId,
        ['common', 'config', 'usrMgmtDatacontextSvc', '$location', usrMgmtRegCtrl]);

    function usrMgmtRegCtrl(common, config, usrMgmtDatacontextSvc, $location) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logInfo = getLogFn(controllerId, "info");
        var logSuccess = getLogFn(controllerId, 'success');
        var logError = getLogFn(controllerId, 'error');
        var selectedRoles = [];

        var vm = this;
        
        vm.contactTypes = ['Home Phone', 'Address', 'Email', 'Work Phone', 'Web Page'];
        vm.genres = ['Male','Female'];
        vm.activeTab = "";
        vm.setActiveTab = setActiveTab;
        vm.adviceWorkMessage = "Please click to expand/collapse this section to add new work information";
        vm.adviceContactMessage = "Please click to expand/collapse this section to add new contact information";
        common.$broadcast(config.events.spinnerToggle, { show: true });
        vm.user = {};
        vm.roles = [];
        vm.toggleRoles = toggleRoles;
        activate();

        
        function activate() {
            common.activateController([usrMgmtDatacontextSvc.ready()], controllerId).then(function () {
                log("Activated Register View");
                vm.addContactToUser = addContactToUser;
                vm.addWorkToUser = addWorkToUser;
                vm.createUser = createUser;
                vm.removeContactToUser = removeContactToUser;
                vm.removeWorkToUser = removeWorkToUser;
                vm.saveChanges = saveChanges;
                createUser();
                getRoles();
                loadInitialTab();
            }).catch(handleError);
            
            function handleError(error) {
                logError("Following errors ocurred:", error, true);
            }
        }
        
        function addContactToUser() {
            usrMgmtDatacontextSvc.addContactToUser(vm.user);
        }
        
        function addWorkToUser() {
            usrMgmtDatacontextSvc.addWorkToUser(vm.user);
        }
        
        function createUser() {
            vm.user = usrMgmtDatacontextSvc.createUser();
        }
        
        function getRoles() {
            usrMgmtDatacontextSvc.getRoles().then(function(roles) {
                vm.roles = roles;
            });
        }
        
        function loadInitialTab() {
            var url = $location.url();
            vm.activeTab = url.split("/")[2];
        }
        
        function removeContactToUser(contact) {
            usrMgmtDatacontextSvc.removeContactToUser(contact);
        }

        function removeWorkToUser(work) {
            usrMgmtDatacontextSvc.removeWorkToUser(work);
        }
        
        
        function saveChanges() {
            common.$broadcast(config.events.spinnerToggle, { show: true });


            vm.user.roles.push.apply(vm.user.roles, selectedRoles);


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
        
        
        
        function setActiveTab(value) {
            vm.activeTab = value;
        }
        
        function toggleRoles(role) {
            var idx = selectedRoles.indexOf(role);

            // is currently selected
            if (idx > -1) {
                selectedRoles.splice(idx, 1);
            }

                // is newly selected
            else {
                selectedRoles.push(role);
            }
        }
    }
})();
