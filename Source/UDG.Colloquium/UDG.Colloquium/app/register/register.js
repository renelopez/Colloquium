(function () {
    'use strict';

    var controllerId = 'registerController';

    angular.module('formApp').controller(controllerId,
        ['$scope','common','registerDatacontext', registerController]);

    function registerController($scope, common,registerDatacontext) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logInfo = getLogFn(controllerId, "info");
        var logSuccess = getLogFn(controllerId, 'success');
        var logError = getLogFn(controllerId, 'error');

        var vm = this;
        vm.user = {};
        //vm.user.works = [];
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
    }
})();
