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

        var vm = this;
        vm.formData = {};
        vm.formData.works = [];
        vm.processForm = processForm;
        vm.removeSelectedWork = removeSelectedWork;
        vm.createWork = createWork;
        vm.removeLastWork = removeLastWork;
        activate();

        
        function activate() {
            common.activateController([], controllerId).then(function() {
                log("Activated Register View");
                createWork();
            });
        }
        
        function processForm() {
            
        }
        
        function createWork() {
            registerDatacontext.postWork(vm.formData.works,{
                workPosition: vm.workPosition,
                workDescription: vm.workDescription,
                workSalary: vm.workSalary,
                workSalarySchema: vm.workSalarySchema,
                workBeginDate: vm.workBeginDate,
                workEndDate: vm.workEndDate,
                company: vm.company,
            });
        }
        
        function removeLastWork() {
            registerDatacontext.removeLastWork(vm.formData.works);
        }

        function removeSelectedWork(index) {
            var selectedWorkToDelete = vm.formData.works[index];
            registerDatacontext.removeSelectedWork(vm.formData.works,selectedWorkToDelete);
        }
    }
})();
