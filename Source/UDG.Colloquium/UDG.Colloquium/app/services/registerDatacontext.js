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
        var applicationUser;

        var service = {
            createUser: createUser,
            ready:ready,
            addWorkToUser: addWorkToUser,
            removeWorkToUser: removeWorkToUser,
        };

        return service;
        
        function createUser() {
            var userCreated = manager.createEntity(applicationUser);
            return userCreated;
        }
        
        function ready() {
            return entityManagerFactory.getEntityManager().then(haveEntityManager);

            function haveEntityManager(em) {
                manager = em;
                applicationUser = manager.metadataStore.getEntityType("ApplicationUser");
            }
        }
        
        function addWorkToUser(user) {
            var workAdded = manager.createEntity("Work", {});
            var companyAdded = manager.createEntity("Company", {});
            workAdded.company = companyAdded;
            user.works.push(workAdded);
            return user;
        }

        function removeWorkToUser(data, work) {
            data.splice(data.indexOf(work), 1);
            work = null;
        }
        


    }
}
)();

