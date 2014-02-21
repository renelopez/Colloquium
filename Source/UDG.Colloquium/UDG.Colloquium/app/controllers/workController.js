(function () {
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


        function addWork() {
            workFactory.postWork({
                workPosition: vm.workPosition,
                workDescription: vm.workDescription,
                workSalary: vm.workSalary,
                workSalarySchema: vm.workSalarySchema,
                workBeginDate: vm.workBeginDate,
                workEndDate:vm.workEndDate
            });
        }

        function deleteWork() {
            workFactory.deleteWork();
        }

        function removeSelectedItem(index) {
            var selectedItemToDelete = vm.works[index];
            workFactory.deleteSelectedWork(selectedItemToDelete);
        }

        vm.addWork();

//#region Internal Methods        

        //#endregion
    }
})();
