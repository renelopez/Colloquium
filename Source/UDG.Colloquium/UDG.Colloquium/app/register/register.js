(function () {
    'use strict';

    var controllerId = 'registerController';

    angular.module('formApp').controller(controllerId,
        ['$rootScope','common','config','registerDatacontext','$location', registerController]);

    function registerController($rootScope, common,config,registerDatacontext,$location) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logInfo = getLogFn(controllerId, "info");
        var logSuccess = getLogFn(controllerId, 'success');
        var logError = getLogFn(controllerId, 'error');

        var events = config.events;

        var vm = this;
        
        vm.contactTypes = ['Home Phone', 'Address', 'Email', 'Work Phone', 'Web Page'];
        vm.genres = ['Male','Female'];
        vm.activeTab = "";
        vm.setActiveTab = setActiveTab;

        vm.busyMessage = 'Please wait ...';
        vm.adviceWorkMessage = "Please add new user information.(Click in order to expand/hide the form.)";
        vm.isBusy = true;
        vm.spinnerOptions = {
            radius: 40,
            lines: 7,
            length: 0,
            width: 30,
            speed: 1.7,
            corners: 1.0,
            trail: 100,
            color: '#F58A00'
        };


        vm.user = {};
        activate();

        
        function activate() {
            common.activateController([registerDatacontext.ready()], controllerId).then(function() {
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
                logSuccess("Order Saved");
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
        
        function toggleSpinner(on) { vm.isBusy = on; }

        $rootScope.$on('$routeChangeStart',
            function (event, next, current) { toggleSpinner(true); }
        );

        $rootScope.$on(events.controllerActivateSuccess,
            function (event, data) { toggleSpinner(false); }
        );

        $rootScope.$on(events.spinnerToggle,
            function (event, data) { toggleSpinner(data.show); }
        );
    }
})();
