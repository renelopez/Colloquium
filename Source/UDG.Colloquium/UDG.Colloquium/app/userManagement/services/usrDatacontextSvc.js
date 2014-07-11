(function() {
    'use strict';

    var serviceId = 'usrDatacontextSvc';
    angular.module('app').factory(serviceId, ['common', 'breeze', 'entityManagerFactory', usrDatacontextSvc]);
    
    function usrDatacontextSvc(common, breeze, entityManagerFactory) {
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
            findUserById:findUserById,
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
        
        function findUserById(id) {
            return breeze.EntityQuery.from("Users").where("id","eq",id)
                .expand("Works")
                .using(manager)
                .execute()
                .then(success)
                .catch(fail);
            
            function success(data) {
                var results = data.results;
                logSuccess("Got " + results.length + " users", null, true);
                return results;
            }
            
            function fail(error) {
                logSuccess("Some errors ocurred:", error, true);
            }
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
                logSuccess("Changes were saved succesfully", saveResult, true);
            }
        }
        


    }
}
)();

