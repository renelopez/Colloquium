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
        vm.removeSelectedWork = removeSelectedWork;
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
            vm.user=registerDatacontext.addWorkToUser(vm.user);
        }

        function removeSelectedWork(index) {
            var selectedWorkToDelete = vm.user.works[index];
            registerDatacontext.removeSelectedWork(vm.user.works,selectedWorkToDelete);
        }
    }
})();
