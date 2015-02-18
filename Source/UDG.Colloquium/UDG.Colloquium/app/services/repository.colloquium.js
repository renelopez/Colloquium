(function () {
    'use strict';

    var serviceId = 'repository.colloquium';

    angular.module('app').factory(serviceId, ['breeze','common','model','repository.abstract', repository]);

    function repository(breeze,common,model, AbstractRepository) {
        var EntityQuery = breeze.EntityQuery;
        var entityName = model.entityNames.colloquium;
        var Predicate = breeze.Predicate;
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
            this.getSessionsByColloquiumId = getSessionsByColloquiumId;

        };

        AbstractRepository.extend(RepoConstructor);

        return RepoConstructor;
        
        function create() { return this.manager.createEntity(entityName); }
        
        function getAll(forceRemote) {
            var colloquiums;
            var self = this;

            if (self._areItemsLoaded() && !forceRemote) {
                colloquiums = self._getAllLocal('Colloquiums', orderBy);
                self.log('Retrieved '+ colloquiums.length +' elements from cache for entity type:' + entityName + '.',null,true);
                return $q.when(colloquiums);
            }


            return EntityQuery.from('Colloquiums')
                .select('id,period,beginDate,endDate')
                .orderBy(orderBy)
                .toType(entityName)
                .using(self.manager)
                .execute()
                .then(success)
                .catch(self._queryFailed);

            function success(data) {
                var results = data.results;
                self._areItemsLoaded(true);
                colloquiums = self._setIsPartialIsTrue(results);
                self.log('Retrieved ' + colloquiums.length + ' elements from server for entity type:' + entityName + '.', null, true);
                return colloquiums;
            }
        }

        function getSessionsByColloquiumId(colloquiumId, forceRemote) {
            var self = this;
            var manager = self.manager;
            var predicate = Predicate.create('id', 'eq', colloquiumId);
            var sessions;
            var colloquium;
            if (!forceRemote) {
                colloquium = manager.getEntityByKey(entityName, parseInt(colloquiumId));
                if (colloquium && !colloquium.isPartial) {
                    self.log('Retrieved ' + colloquium.sessions.length + ' elements from cache for entity type:' + entityName + '.', null, true);
                    return $q.when(colloquium.sessions);
                }
            }
            return EntityQuery.from("Colloquiums")
                .expand("sessions,sessions.applicationUser")
                 .where(predicate)
                 .orderBy(orderBy)
                 .toType(entityName)
                 .using(manager)
                 .execute()
                 .then(success)
                 .catch(this._queryFailed);

            function success(data) {
                sessions = data.results[0].sessions;
                if (!sessions) {
                    self.log('Couldnt find [' + entityName + '] for colloquiumId:' + colloquiumId, null, true);
                    return null;
                }
                colloquium.isPartial = false;
                self.log('Retrieved ' + sessions.length + ' elements from server for entity type:' + entityName + '.', null, true);
                return sessions;
            }

        }
        
        

        function getById(id, forceRemote) {
            return this._getById(entityName, id, forceRemote);
        }
        
    }
})();