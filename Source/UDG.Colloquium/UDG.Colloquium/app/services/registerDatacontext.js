(function() {
    'use strict';

    var serviceId = 'registerDatacontext';
    //angular.module('formApp').factory(serviceId, ['common', 'breeze', 'entityManagerFactory', datacontext]);
    angular.module('formApp').factory(serviceId, ['common', registerDatacontext]);

    //function datacontext(common, breeze, entityManagerFactory) {
    function registerDatacontext(common) {
        var $q = common.$q;
        //var manager = entityManagerFactory.getEntityManager();

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, 'error');
        var logSuccess = getLogFn(serviceId, 'success');

        var service = {
            postWork: postWork,
            removeLastWork: removeLastWork,
            removeSelectedWork:removeSelectedWork
        };

        return service;
        
        function postWork(data,work) {
            data.works.push(work);
        }
        
        function removeLastWork(data) {
            data.works.pop();
        }

        function removeSelectedWork(data,work) {
            data.works.splice(data.works.indexOf(work), 1);
            work = null;
        }
        


    }
}
)();

