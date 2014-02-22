﻿(function () {
    'use strict';

    // Controller name is handy for logging
    var controllerId = 'workController';

    // Define the controller on the module.
    // Inject the dependencies. 
    // Point to the controller definition function.
    angular.module('workModule').controller(controllerId,
        ['$scope','workFactory', workController]);

    function workController($scope,workFactory) {
        // Using 'Controller As' syntax, so we assign this to the vm variable (for viewmodel).
        var vm = this;
        // Bindable properties and functions are placed on vm.
        vm.works = workFactory.getWorks();
        vm.addWork = addWork;
        vm.deleteWork = deleteWork;
        vm.removeSelectedItem = removeSelectedItem;
        vm.showCompanyForm = showCompanyForm;
        vm.hideCompanyForm = hideCompanyForm;
        vm.companyFormVisible = false;

        function addWork() {
            workFactory.postWork({
                workPosition: vm.workPosition,
                workDescription: vm.workDescription,
                workSalary: vm.workSalary,
                workSalarySchema: vm.workSalarySchema,
                workBeginDate: vm.workBeginDate,
                workEndDate: vm.workEndDate,
                company: vm.company,
                companyFormVisible:vm.companyFormVisible
            });
        }

        function deleteWork() {
            workFactory.deleteWork();
        }

        function removeSelectedItem(index) {
            var selectedItemToDelete = vm.works[index];
            workFactory.deleteSelectedWork(selectedItemToDelete);
        }

        function showCompanyForm(index) {
            var selectedWorkToShowCompanyForm = vm.works[index];
            workFactory.showCompanyForm(selectedWorkToShowCompanyForm);
        }
        function hideCompanyForm(index) {
            var selectedWorkToHideCompanyForm = vm.works[index];
            workFactory.hideCompanyForm(selectedWorkToHideCompanyForm);
        }

        vm.addWork();

//#region Internal Methods        

        //#endregion
    }
})();
