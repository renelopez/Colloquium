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
        vm.processForm = processForm;
        vm.removeSelectedWork = removeSelectedWork;
        vm.addWork = addWork;
        vm.removeLastWork = removeLastWork;
        vm.showCompanyForm = showCompanyForm;
        vm.hideCompanyForm = hideCompanyForm;
        activate();

        
        function activate() {
            common.activateController([], controllerId).then(function() {
                log("Activated Register View");
                addWork();
            });
        }
        
        function processForm() {
            
        }
        
        function addWork() {
            registerDatacontext.postWork(formData,{
                workPosition: vm.workPosition,
                workDescription: vm.workDescription,
                workSalary: vm.workSalary,
                workSalarySchema: vm.workSalarySchema,
                workBeginDate: vm.workBeginDate,
                workEndDate: vm.workEndDate,
                company: vm.company,
                companyFormVisible: vm.companyFormVisible
            });
        }
        
        function removeLastWork() {
            registerDatacontext.removeLastWork(formData);
        }

        function removeSelectedWork(work) {
            var selectedWorkToDelete = vm.formData.works[work];
            registerDatacontext.removeSelectedWork(formData,selectedWorkToDelete);
        }
        
        function showCompanyForm(work) {
            var works = vm.formData.works;
            works[works.indexOf(work)].companyFormVisible = true;
        }
        
        function hideCompanyForm(work) {
            var works = vm.formData.works;
            works[works.indexOf(work)].companyFormVisible = false;
        }
        

    }
})();
