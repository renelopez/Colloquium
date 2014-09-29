(function () {
    'use strict';

    var serviceId = 'repository.colloquium';

    angular.module('app').factory(serviceId, ['breeze','common','model','repository.abstract', repository]);

    function repository(breeze,common,model, AbstractRepository) {
        var EntityQuery = breeze.EntityQuery;
        var entityName = model.entityNames.colloquium;
        var orderBy = 'period';
        
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
            this.getAll = getAll;
            this.getById = getById;
            this.getColloquiumSessionsById = getColloquiumSessionsById;
            
        };

        AbstractRepository.extend(RepoConstructor);

        return RepoConstructor;
        
        function create() { return this.manager.createEntity(entityName); }
        
        function getAll(forceRemote) {
            var colloquiums;
            var self = this;

            if (self._areItemsLoaded() && !forceRemote) {
                colloquiums = self._getAllLocal('Colloquiums', orderBy);
                return $q.when(colloquiums);
            }


            return EntityQuery.from('Colloquiums')
                .using(self.manager)
                .execute()
                .then(success)
                .catch(self._queryFailed);

            function success(data) {
                var results = data.results;
                self._areItemsLoaded(true);
                logSuccess("Colloquiums were succesfully retrieved.", null, true);
                return results;
            }
        }

        function getColloquiumSessionsById(id, forceRemote) {
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

            return EntityQuery.from("Colloquiums").where("id", "eq", id)
                 .expand("Sessions")
                 .using(self.manager)
                 .execute()
                 .then(success)
                 .catch(this._fail);

            function success(data) {
                var results = data.results[0];
                logSuccess("Colloquium sessions data was succesfully retrieved.", null, true);
                return results;
            }
        }
        

        function getById(id, forceRemote) {
            return this._getById(entityName, id, forceRemote);
        }
        
    }
})();