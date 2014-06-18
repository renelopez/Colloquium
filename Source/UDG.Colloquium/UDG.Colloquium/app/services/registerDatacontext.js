(function() {
    'use strict';

    var serviceId = 'registerDatacontext';
    angular.module('formApp').factory(serviceId, ['common', 'breeze', 'entityManagerFactory', registerDatacontext]);
    //angular.module('formApp').factory(serviceId, ['common', registerDatacontext]);

    //function datacontext(common, breeze, entityManagerFactory) {
    function registerDatacontext(common,breeze,entityManagerFactory) {
        var $q = common.$q;
        var manager;

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, 'error');
        var logSuccess = getLogFn(serviceId, 'success');

        var service = {
            createUser: createUser,
            ready:ready,
            removeLastWork: removeLastWork,
            removeSelectedWork: removeSelectedWork,
        };

        return service;
        
        function createUser() {
            var user = manager.createEntity("ApplicationUser", {
                birthDate: new Date().toUTCString()
            });
            return user;
        }
        
        function ready() {
            return entityManagerFactory.getEntityManager().then(haveEntityManager);

            function haveEntityManager(em) {
                manager = em;
            }
        }
        
        function removeLastWork(data) {
            data.pop();
        }

        function removeSelectedWork(data,work) {
            data.splice(data.indexOf(work), 1);
            work = null;
        }
        


    }
}
)();

