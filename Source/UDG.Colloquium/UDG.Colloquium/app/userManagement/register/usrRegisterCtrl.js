(function () {
    'use strict';

    var controllerId = 'usrRegisterCtrl';

    angular.module('app').controller(controllerId,
        ['common', 'config', 'usrDatacontextSvc', '$location', '$scope', usrRegisterCtrl]);

    function usrRegisterCtrl(common, config, registerDatacontext, $location, $scope) {
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
        common.$broadcast(config.events.spinnerToggle, { show: true });
        vm.user = {};
        activate();

        
        function activate() {
            common.activateController([registerDatacontext.ready()], controllerId).then(function () {
                log("Activated Register View");
                vm.addContactToUser = addContactToUser;
                vm.addWorkToUser = addWorkToUser;
                vm.createOrEditUser = createOrEditUser;
                vm.removeContactToUser = removeContactToUser;
                vm.removeWorkToUser = removeWorkToUser;
                vm.saveChanges = saveChanges;
                createOrEditUser();
                loadInitialTab();
            }).catch(handleError);
            
            function handleError(error) {
                logError("Following errors ocurred:", error, true);
            }
        }
        
        function createOrEditUser() {
            var userToEdit = $location.search("userId");
            vm.user = registerDatacontext.createUser();
        }
        
        function addContactToUser() {
            registerDatacontext.addContactToUser(vm.user);
        }
        
        function addWorkToUser() {
            registerDatacontext.addWorkToUser(vm.user);
        }
        
        function removeContactToUser(contact) {
            registerDatacontext.removeContactToUser(contact);
        }

        function removeWorkToUser(work) {
           registerDatacontext.removeWorkToUser(work);
        }
        
        function saveChanges() {
            common.$broadcast(config.events.spinnerToggle, { show: true });
            registerDatacontext.saveChanges().then(success).catch(errorSave);
            
            
            function success() {
                common.$broadcast(config.events.spinnerToggle, { show: false });
                logSuccess("User "+vm.user.userName+" was succesfully created");
            }
            
            function errorSave(error) {
                logError("Following errors ocurred:", error, true);
            }
        }
        
        function loadInitialTab() {
            var url = $location.url();
            vm.activeTab = url.split("/")[2];
        }
        
        function setActiveTab(value) {
            vm.activeTab = value;
        }
    }
})();
