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
        //vm.formData.works = [];
        vm.processForm = processForm;
        vm.removeSelectedWork = removeSelectedWork;
        activate();

        
        function activate() {
            common.activateController([registerDatacontext.ready()], controllerId).then(function() {
                log("Activated Register View");
                //vm.createWork = createWork;
                //vm.removeLastWork = removeLastWork;
                vm.createUser = createUser;
                createUser();
            }).catch(handleError);
            
            function handleError(error) {
                logError("Valio madres:", error, true);
            }
        }
        
        function processForm() {
            
        }
        
        function createUser() {
            //registerDatacontext.postWork(vm.formData.works,{
            //    workPosition: vm.workPosition,
            //    workDescription: vm.workDescription,
            //    workSalary: vm.workSalary,
            //    workSalarySchema: vm.workSalarySchema,
            //    workBeginDate: vm.workBeginDate,
            //    workEndDate: vm.workEndDate,
            //    company: vm.company,
            //});
            vm.user = registerDatacontext.createUser();
        }
        
        function removeLastWork() {
            registerDatacontext.removeLastWork(vm.user.works);
        }

        function removeSelectedWork(index) {
            var selectedWorkToDelete = vm.user.works[index];
            registerDatacontext.removeSelectedWork(vm.user.works,selectedWorkToDelete);
        }
    }
})();
