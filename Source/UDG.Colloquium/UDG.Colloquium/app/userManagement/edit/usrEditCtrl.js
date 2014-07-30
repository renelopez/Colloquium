(function () {
    'use strict';

    var controllerId = 'usrEditCtrl';

    angular.module('app').controller(controllerId,
        ['common', 'config', 'usrDatacontextSvc', '$location', '$stateParams','$scope', usrEditCtrl]);

    function usrEditCtrl(common, config, usrDatacontextSvc, $location, $stateParams,$scope) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logInfo = getLogFn(controllerId, "info");
        var logSuccess = getLogFn(controllerId, 'success');
        var logError = getLogFn(controllerId, 'error');
        var stateParams = $stateParams;

        var vm = this;
        
        vm.contactTypes = ['Home Phone', 'Address', 'Email', 'Work Phone', 'Web Page'];
        vm.genres = ['Male','Female'];
        vm.activeTab = "";
        vm.setActiveTab = setActiveTab;
        vm.adviceWorkMessage = "Please click to expand/collapse this section to add new work information";
        vm.adviceContactMessage = "Please click to expand/collapse this section to add new contact information";
        vm.user = {};
        activate();

        
        function activate() {
            common.activateController([usrDatacontextSvc.ready()], controllerId).then(function () {
                log("Activated Register View");
                vm.addContactToUser = addContactToUser;
                vm.addWorkToUser = addWorkToUser;
                vm.removeContactToUser = removeContactToUser;
                vm.removeWorkToUser = removeWorkToUser;
                vm.saveChanges = saveChanges;
                findUserById($stateParams.userId);
                loadInitialTab();
            }).catch(handleError);
            
            function handleError(error) {
                common.$broadcast(config.events.spinnerToggle, { show: false });
                logError("Following errors ocurred:", error, true);
            }
        }
        
        function addContactToUser() {
            usrDatacontextSvc.addContactToUser(vm.user);
        }
        
        function addWorkToUser() {
            usrDatacontextSvc.addWorkToUser(vm.user);
        }

        function findUserById(id) {
            common.$broadcast(config.events.spinnerToggle, { show: true });
            return usrDatacontextSvc.findUserById(id).then(function (user) {
                common.$broadcast(config.events.spinnerToggle, { show: false });
               return vm.user = user[0];
            });
        }
    

        function removeContactToUser(contact) {
            usrDatacontextSvc.removeContactToUser(contact);
        }

        function removeWorkToUser(work) {
            usrDatacontextSvc.removeWorkToUser(work);
        }
        
        function saveChanges() {
            common.$broadcast(config.events.spinnerToggle, { show: true });
            usrDatacontextSvc.saveChanges().then(success).catch(errorSave);
            
            
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
