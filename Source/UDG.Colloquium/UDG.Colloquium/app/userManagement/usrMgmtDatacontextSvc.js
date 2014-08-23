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

        var storeMeta = {
            isLoaded: {
                roles: false,
                userRoles: false
            }
        };

        var service = {
            addContactToUser: addContactToUser,
            addRoleToUser:addRoleToUser,
            addWorkToUser: addWorkToUser,
            createUser: createUser,
            findUserById: findUserById,
            getRoles: getRoles,
            getUserRoles:getUserRoles,
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
            var userRoleAdded = manager.createEntity("ApplicationUserRole", {
                userId:user.id,
                roleId: role.id,
            });
            user.roles.push(userRoleAdded);
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
        
        function getRoles(forceRemote) {
            
            if (_areRolesLoaded() && !forceRemote) {
                var attend
            }


            return breeze.EntityQuery.from('Roles')
                .using(manager)
                .execute()
                .then(success)
                .catch(_fail);
            
            function success(data) {
                var results = data.results;
                _areRolesLoaded(true);
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
        
        function removeRoleToUser(user,role) {
            for (var i = 0; i < user.roles.length; i++) {
                if (user.roles[i].roleId === role.id) {
                    user.roles[i].entityAspect.setDeleted();
                    user.roles.splice(i, 1);
                    break;
                }
            }
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
        
        function _areRolesLoaded(value) {
            return _areItemsLoaded('roles', value);
        }
        
        function _areItemsLoaded(key, value) {
            if (value === undefined) {
                return storeMeta.isLoaded[key]; // get
            }
            return storeMeta.isLoaded[key] = value; // set
        }
        
        function _fail(error) {
            logError("Some errors ocurred:", error, true);
        }
    }
}
)();

