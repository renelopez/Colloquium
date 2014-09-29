(function() {
    'use strict';

    var serviceId = 'datacontext';
    angular.module('app').factory(serviceId, ['breeze', 'common','config', 'entityManagerFactory','lodash','repositories','model', usrMgmtDatacontextSvc]);
    
    function usrMgmtDatacontextSvc(breeze, common,config,entityManagerFactory,lodash,repositories, model) {
        var $q = common.$q;

        var events = config.events;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, 'error');
        var logSuccess = getLogFn(serviceId, 'success');
        var entityNames = model.entityNames;
        var repoNames = ['colloquium','session','user', 'role','company','contact','urole','work']; 
        var manager = entityManagerFactory.newManager();

        var storeMeta = {
            isLoaded: {
                roles: false,
                userRoles: false
            }
        };

        var service = {
            //addContactToUser: addContactToUser,
            //addRoleToUser:addRoleToUser,
            //addWorkToUser: addWorkToUser,
            cancel:cancel,
            //createUser: createUser,
            //findUserById: findUserById,
            //getRoles: getRoles,
            markDeleted:markDeleted,
            //removeRoleToUser: removeRoleToUser,
            saveChanges:saveChanges,
        };

        init();

        return service;
        
        function init() {
            repositories.init(manager);
            defineLazyLoadedRepos();
            setupEventForHasChangesChanged();
        }
        
        function defineLazyLoadedRepos() {
            repoNames.forEach(function(repoName) {
                Object.defineProperty(service, repoName, {
                    configurable: true,
                    get: function() {
                        var repo = repositories.getRepo(repoName);
                        Object.defineProperty(service, repoName, {
                            value: repo,
                            configurable: false,
                            enumerable: true
                        });
                        return repo;
                    }
                });
            });
        }
        
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
            var roles;
            
            if (_areRolesLoaded() && !forceRemote) {
                roles = _getAllLocal(entityNames.role, orderBy);
                return $q.when(roles);
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

        function cancel() {
            if (manager.hasChanges()) {
                manager.rejectChanges();
                logSuccess('Canceled changes', null, true);
            }
        }
        
        
        function markDeleted(entity) {
            entity.entityAspect.setDeleted();
        }
        
        function removeRoleToUser(user, role) {
            var userRoleToRemove = lodash.find(user.roles, function(userRole) {
                return userRole.roleId === role.id;
            });

            markDeleted(userRoleToRemove);

            lodash.remove(user.roles, function(userRole) {
                return userRoleToRemove === userRole;
            });
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
        
        
        function _areItemsLoaded(key, value) {
            if (value === undefined) {
                return storeMeta.isLoaded[key]; // get
            }
            return storeMeta.isLoaded[key] = value; // set
        }
        
        function _areRolesLoaded(value) {
            return _areItemsLoaded('roles', value);
        }
        
        function _getAllLocal(resource, ordering, predicate) {
            return breeze.EntityQuery.from(resource)
                .orderBy(ordering)
                .where(predicate)
                .using(manager)
                .executeLocally();
        }
        
        function _fail(error) {
            logError("Some errors ocurred:", error, true);
        }

        function setupEventForHasChangesChanged() {
            manager.hasChangesChanged.subscribe(function(eventArgs) {
                var data = { hasChanges: eventArgs.hasChanges };
                common.$broadcast(events.hasChangesChanged, data);
            });
        }
    }
}
)();

