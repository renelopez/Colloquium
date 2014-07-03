(function() {
    'use strict';

    var serviceId = 'registerDatacontext';
    angular.module('formApp').factory(serviceId, ['common', 'breeze', 'entityManagerFactory', registerDatacontext]);
    
    function registerDatacontext(common,breeze,entityManagerFactory) {
        var $q = common.$q;
        var manager;

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, 'error');
        var logSuccess = getLogFn(serviceId, 'success');
        var applicationUser;

        var service = {
            addContactToUser:addContactToUser,
            addWorkToUser: addWorkToUser,
            createUser: createUser,
            ready:ready,
            rejectChanges: rejectChanges,
            removeContactToUser: removeContactToUser,
            removeWorkToUser: removeWorkToUser,
            saveChanges:saveChanges,
        };

        return service;
        
        function addContactToUser(user) {
            var contactAdded = manager.createEntity("Contact", {});
            user.contacts.push(contactAdded);
        }
        
        function addWorkToUser(user) {
            var workAdded = manager.createEntity("Work", {});
            var companyAdded = manager.createEntity("Company", {});
            workAdded.company = companyAdded;
            user.works.push(workAdded);
        }
        
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
        
        function rejectChanges() {
            manager.rejectChanges();
           // var changes = manager.getChanges();
        }
        
        
        function removeContactToUser(contact) {
            contact.entityAspect.setDeleted();
        }

        function removeWorkToUser(work) {
            work.entityAspect.setDeleted();
        }
        
        function saveChanges() {
            return manager.saveChanges()
                    .catch(saveFailed)
                    .then(saveSuccess);
            
            function saveFailed(error) {
                var msg = "Save failed " + breeze.saveErrorMessageService.getErrorMessage(error);
                error.message = msg;
                logError(msg, error, true);
                throw error;
            }
            
            function saveSuccess(saveResult) {
                logSuccess(saveResult, null, true);
            }
        }
        


    }
}
)();

