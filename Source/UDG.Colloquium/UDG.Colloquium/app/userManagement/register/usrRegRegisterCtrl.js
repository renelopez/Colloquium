(function () {
    'use strict';

    var controllerId = 'usrRegRegisterCtrl';

    angular.module('app').controller(controllerId,
        ['common', 'config', 'usrDatacontextSvc', '$location', '$scope', usrRegRegisterCtrl]);

    function usrRegRegisterCtrl(common, config, registerDatacontext, $location, $scope) {
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
        common.$broadcast(config.events.spinnerToggle, { show: true });
        vm.user = {};
        activate();

        
        function activate() {
            common.activateController([registerDatacontext.ready()], controllerId).then(function () {
                log("Activated Register View");
                vm.addContactToUser = addContactToUser;
                vm.addWorkToUser = addWorkToUser;
                vm.createUser = createUser;
                vm.removeContactToUser = removeContactToUser;
                vm.removeWorkToUser = removeWorkToUser;
                vm.saveChanges = saveChanges;
                createUser();
                loadInitialTab();
            }).catch(handleError);
            
            function handleError(error) {
                logError("Following errors ocurred:", error, true);
            }
        }
        
        function createUser() {
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
            registerDatacontext.saveChanges().then(success).catch(errorSave);
            
            
            function success() {
                logSuccess("User information was correctly saved");
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
