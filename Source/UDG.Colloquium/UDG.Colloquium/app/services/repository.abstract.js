(function () {
    'use strict';

    var serviceId = 'repository.abstract';

    
    angular.module('app').factory(serviceId, ['breeze','common','config', repository]);

    function repository(breeze,common,config) {
        var EntityQuery = breeze.EntityQuery;
        var logError = common.logger.getLogFn(this.serviceId, 'error');
        var $q = common.$q;

        function AbstractConstructor() {
            this.isLoaded = false;
        }
        
        AbstractConstructor.extend = function (repoConstructor) {
            repoConstructor.prototype = new AbstractConstructor();
            repoConstructor.prototype.constructor = repoConstructor;
        };
        
        AbstractConstructor.prototype._areItemsLoaded = _areItemsLoaded;
        AbstractConstructor.prototype._getAllLocal = _getAllLocal;
        AbstractConstructor.prototype._getById = _getById;
        AbstractConstructor.prototype._queryFailed = _queryFailed;
        AbstractConstructor.prototype._setIsPartialIsTrue = _setIsPartialIsTrue;
        AbstractConstructor.prototype.log = common.logger.getLogFn(this.serviceId);
        AbstractConstructor.prototype.$q = common.$q;

        return AbstractConstructor;

        function _areItemsLoaded(value) {
            if (value === undefined) {
                return this.isLoaded; // get
            }
            return this.isLoaded = value; // set
        }

        function _getAllLocal(resource, ordering,predicate) {
            return EntityQuery.from(resource)
                .where(predicate)
                .orderBy(ordering)
                .toType(resource)
                .using(this.manager)
                .executeLocally();
        }
        
        function _getById(entityName, id, forceRemote) {
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

            // Hit the server
            // It was not found in cache, so let's query for it.
            return manager.fetchEntityByKey(entityName, id)
                .then(querySucceeded)
                .catch(self._queryFailed);

            function querySucceeded(data) {
                entity = data.entity;
                if (!entity) {
                    self.log('Could not find [' + entityName + '] id:' + id, null, true);
                    return null;
                }
                entity.isPartial = false;
                self.log('Retrieved [' + entityName + '] id ' + entity.id
                    + ' from remote data source', entity, true);
                return entity;
            }
        }
        
        function _queryFailed(error) {
            var msg = config.appErrorPrefix + 'Error retrieving data.' + error.message;
            logError(msg, error);
            throw error;
        }
        
        function _setIsPartialIsTrue(entities) {
            for (var i = entities.length; i--;) {
                entities[i].isPartial = true;
            }
            return entities;
        }

    }
})();