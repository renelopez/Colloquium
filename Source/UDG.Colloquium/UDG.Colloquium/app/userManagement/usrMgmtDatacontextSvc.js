(function() {
    'use strict';

    var serviceId = 'usrMgmtDatacontextSvc';
    angular.module('app').factory(serviceId, ['common', 'breeze', 'entityManagerFactory', usrMgmtDatacontextSvc]);
    
    function usrMgmtDatacontextSvc(common, breeze, entityManagerFactory) {
        var $q = common.$q;
        var manager;

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, 'error');
        var logSuccess = getLogFn(serviceId, 'success');
        var applicationUser;

        var service = {
            addContactToUser: addContactToUser,
            addRoleToUser:addRoleToUser,
            addWorkToUser: addWorkToUser,
            createUser: createUser,
            findUserById: findUserById,
            getRoles:getRoles,
            ready:ready,
            rejectChanges: rejectChanges,
            removeContactToUser: removeContactToUser,
            removeWorkToUser: removeWorkToUser,
            removeRoleToUser: removeRoleToUser,
            saveChanges:saveChanges,
        };

        return service;
        
        function addContactToUser(user) {
            var contactAdded = manager.createEntity("Contact", {});
            user.contacts.push(contactAdded);
        }
        
        function addRoleToUser(user,role) {
            var roleAdded = manager.createEntity("ApplicationRole", role);
            user.roles.push(roleAdded);
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
                .expand("Works.Company,Contacts")
                .using(manager)
                .execute()
                .then(success)
                .catch(_fail);
            
            function success(data) {
                var results = data.results;
                logSuccess("User data was succesfully retrieved.", null, true);
                return results;
            }
        }
        
        function getRoles() {
            return breeze.EntityQuery.from('Roles')
                .using(manager)
                .execute()
                .then(success)
                .catch(_fail);
            
            function success(data) {
                var results = data.results;
                logSuccess("User roles were succesfully retrieved.", null, true);
                return results;
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
        }
        
        
        function removeContactToUser(contact) {
            contact.entityAspect.setDeleted();
        }

        function removeWorkToUser(work) {
            work.entityAspect.setDeleted();
        }
        
        function removeRoleToUser(role) {
            role.entityAspect.setDeleted();
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
        
        function _fail(error) {
            logError("Some errors ocurred:", error, true);
        }
    }
}
)();

