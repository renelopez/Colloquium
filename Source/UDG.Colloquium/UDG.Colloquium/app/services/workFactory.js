(function () {
    'use strict';

    // Factory name is handy for logging
    var serviceId = 'workFactory';

    // Define the factory on the module.
    // Inject the dependencies. 
    // Point to the factory definition function.
    // TODO: replace app with your module name
    angular.module('workModule').factory(serviceId, [workFactory]);

    function workFactory() {
        // Define the functions and properties to reveal.
        var works = [];

        var service = {
            getWorks: getWorks,
            postWork: postWork,
            deleteWork: deleteWork,
            deleteSelectedWork: deleteSelectedWork,
            showCompanyForm: showCompanyForm,
            hideCompanyForm: hideCompanyForm
        };

        return service;

        function getWorks() {
            return works;
        }

        function postWork(work) {
            works.push(work);
        }

        function deleteWork() {
            works.pop();
        }

        function deleteSelectedWork(work) {
            works.splice(works.indexOf(work), 1);
            work = null;
        }

        function showCompanyForm(work) {
            works[works.indexOf(work)].companyFormVisible = true;
        }

        function hideCompanyForm(work) {
            works[works.indexOf(work)].companyFormVisible = false;
        }


        //#region Internal Methods        

        //#endregion
    }
})();