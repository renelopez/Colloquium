(function () {
    'use strict';

    var serviceId = 'repository.user';

    angular.module('app').factory(serviceId, ['breeze','common','model','repository.abstract', repository]);

    function repository(breeze,common,model, AbstractRepository) {
        var EntityQuery = breeze.EntityQuery;
        var entityName = model.entityNames.user;
        var orderBy = 'id';
        var Predicate = breeze.Predicate;
        var isActivePredicate = Predicate.create('isActive', 'eq', true);
        
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);
        var logInfo = getLogFn(serviceId, "info");
        var logSuccess = getLogFn(serviceId, 'success');
        var logError = getLogFn(serviceId, 'error');
        var $q = common.$q;

        function RepoConstructor(manager) {
            this.serviceId = serviceId;
            this.entityName = entityName;
            this.manager = manager;
            // Data Access
            this.create = create;
            this.getById = getById;
            this.getAll = getAll;
            this.getCount = getCount;
            this.getFilteredCount = getFilteredCount;
            this.getEntityByName = getEntityByName;
            this.getTypeaheadData = getTypeaheadData;
            this.getUserRolesById = getUserRolesById;
        };

        AbstractRepository.extend(RepoConstructor);

        return RepoConstructor;
        
        function create() { return this.manager.createEntity(entityName, {isActive:true}); }

        function getAll(page, size, filter, forceRemote) {
            var users;
            var self = this;
            var take = size || 10;
            var skip = page ? (page - 1) * size : 0;

            if (self._areItemsLoaded() && !forceRemote) {
                users = self._getAllLocal('Users', orderBy,isActivePredicate);
                self.log('Retrieved ' + users.length + ' elements from cache for entity type:' + entityName + '.', null, true);
                return $q.when(getByPage());
            }


            return EntityQuery.from('Users')
                .select('id,userName,firstName,lastName,isActive')
                .toType(entityName)
                .using(self.manager)
                .execute()
                .then(success)
                .catch(self._queryFailed);

            function success(data) {
                if (!data.results) {
                    self.log('Could not find [' + entityName + ']', null, true);
                    return null;
                }
                self._areItemsLoaded(true);
                self._setIsPartialIsTrue(data.results);
                self.log('Retrieved ' + data.results.length + ' elements from server for entity type:' + entityName + '.', null, true);
                return getByPage();
            }

            function getByPage() {
                return EntityQuery.from('Users')
                    .select('id,userName,firstName,lastName,isActive')
                    .where(isActivePredicate)
                    .take(take)
                    .skip(skip)
                    .toType(entityName)
                    .using(self.manager)
                    .executeLocally();
            }
        }
        
        function getById(id,forceRemote) {
            var self = this;
            var manager = self.manager;
            if (!forceRemote) {
                // check cache first
                var entity = manager.getEntityByKey(entityName, id);
                if (entity && !entity.isPartial) {
                    self.log('Retrieved [' + entityName + '] id:' + entity.id + ' from cache.', entity, true);
                    if (entity.entityAspect.entityState.isDeleted()) {
                        entity = null; // hide session marked-for-delete
                    }
                    return $q.when(entity);
                }
            }
            
            return EntityQuery.from("Users").where("id", "eq", true)
                 .expand("works.company,contacts")
                 .where(isActivePredicate)
                 .using(self.manager)
                 .toType(self.entityName)
                 .execute()
                 .then(success)
                 .catch(self._queryFailed);

            function success(data) {
                var results = data.results[0];
                if (!results) {
                    self.log('Couldnt find [' + entityName + '] id:' + id, null, true);
                    return null;
                }
                results.isPartial = false;
                self.log('Retrieved [' + entityName + '] id:' + results.id+' from remote data source',entity, true);
                return results;
            }
        }

        function getEntityByName(fullName, forceRemote) {
            var self = this;
            var manager = self.manager;
            var projection = "";
            var splitFullName = fullName.split(' ');
            var firstName = splitFullName[0];
            var lastName = splitFullName[1];
            var predicate = Predicate.create('firstName', 'eq', firstName)
                .and('lastName', 'eq', lastName)
                .and('isActive', 'eq', true);
            var user;


            if (!forceRemote) {
                user = self._getAllLocal(entityName, orderBy, predicate)[0];
                if (user && !user.isPartial) {
                    self.log('Retrieved [' + entityName + '] id:' + user.id + ' from cache.', user, true);
                    if (user.entityAspect.entityState.isDeleted()) {
                        user = null; // hide session marked-for-delete
                    }
                    return $q.when(user);
                }
            }
            return EntityQuery.from("Users")
                 .where(predicate)
                 .orderBy(orderBy)
                 .using(manager)
                 .execute()
                 .then(success)
                 .catch(this._fail);

            function success(data) {
                var results = data.results[0];
                if (!results) {
                    self.log('Couldnt find [' + entityName + '] name:' + fullName, null, true);
                    return null;
                }
                results.isPartial = false;
                self.log('Retrieved [' + entityName + '] name:' + results.firstName + ' ' + results.lastName + ' from remote data source', results, true);
                return results;
            }
        }
        
        function getTypeaheadData(name) {
            var self = this;
            var users;
            var predicate = Predicate.create('firstName', 'substringof', name).and('isActive','eq',true);
            return EntityQuery.from("Users")
                 .where(predicate)
                 .select('firstName,lastName')
                 .orderBy(orderBy)
                 .using(self.manager)
                 .execute()
                 .then(success)
                 .catch(this._fail);

            function success(data) {
                //users = self._setIsPartialIsTrue(data.results);
                //self._areItemsLoaded(true);
                //logSuccess("User data was succesfully retrieved.", null, true);
                return data.results;
            }
        }

        function getUserRolesById(id) {
            var user;
            var self = this;
            return EntityQuery.from("Users").where("id", "eq", id).and('isActive','eq',true)
                 .expand("roles")
                 .using(self.manager)
                 .execute()
                 .then(success)
                 .catch(this._fail);

            function success(data) {
                user = data.results[0];
                if (!user) {
                    self.log('Couldnt find [' + entityName + '] id:' + id, null, true);
                    return null;
                }
                self.log('Retrieved [' + entityName + '] id:' + user.id + ' from remote data source', user, true);
                return user;
            }
        }

        function getCount() {
            var self = this;
            if (self._areItemsLoaded()) {
                return self._getLocalCount('Users');
            }

            return EntityQuery.from("Users")
                 .using(self.manager)
                 .where(isActivePredicate)
                 .execute()
                 .then(success)
                 .catch(this._fail);

            function success(data) {
                return data.results.inlineCount;
            }
        }

        function getFilteredCount(filter) {
            var self = this;
            var predicate = _getFilterPredicate(filter);
            var users= EntityQuery.from("Users")
                .where(predicate)
                .using(self.manager)
                .executeLocally();
            return $q.when(users.length);
        }
        


        function _getFilterPredicate(filter) {
            return Predicate.create('firstName', 'contains', filter).and('isActive', 'eq', true);
        }

       

        

        
    }
})();