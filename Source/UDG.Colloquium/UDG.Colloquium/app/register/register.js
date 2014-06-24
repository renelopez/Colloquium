(function () {
    'use strict';

    var controllerId = 'registerController';

    angular.module('formApp').controller(controllerId,
        ['$rootScope','common','config','registerDatacontext', registerController]);

    function registerController($rootScope, common,config,registerDatacontext) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logInfo = getLogFn(controllerId, "info");
        var logSuccess = getLogFn(controllerId, 'success');
        var logError = getLogFn(controllerId, 'error');

        var events = config.events;

        var vm = this;
        
        vm.busyMessage = 'Please wait ...';
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
        vm.processForm = processForm;
        vm.removeWorkToUser = removeWorkToUser;
        vm.saveChanges = saveChanges;
        activate();

        
        function activate() {
            common.activateController([registerDatacontext.ready()], controllerId).then(function() {
                log("Activated Register View");
                vm.createUser = createUser;
                vm.addWorkToUser = addWorkToUser;
                createUser();
            }).catch(handleError);
            
            function handleError(error) {
                logError("Valio madres:", error, true);
            }
        }
        
        function processForm() {
            
        }
        
        function createUser() {
            vm.user = registerDatacontext.createUser();
        }
        
        function addWorkToUser() {
            //registerDatacontext.rejectChanges();
            registerDatacontext.addWorkToUser(vm.user);
        }

        function removeWorkToUser(work) {
           registerDatacontext.removeWorkToUser(work);
        }
        
        function saveChanges() {
            registerDatacontext.saveChanges()
                .then(success)
                .fail(errorSave);
            
            function success() {
                logSuccess("Order Saved");
            }
            
            function errorSave(error) {
                logError("Valio madres la grabada:", error, true);
            }
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
