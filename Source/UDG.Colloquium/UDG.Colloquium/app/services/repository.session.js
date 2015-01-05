(function () {
    'use strict';

    var serviceId = 'repository.session';

    angular.module('app').factory(serviceId, ['breeze','common','model','repository.abstract', repository]);

    function repository(breeze,common,model, AbstractRepository) {
        var EntityQuery = breeze.EntityQuery;
        var Predicate = breeze.Predicate;
        var entityName = model.entityNames.session;
        var orderBy = 'id';
        
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
            this.getSessionsByColloquiumId = getSessionsByColloquiumId;
            
        };

        AbstractRepository.extend(RepoConstructor);

        return RepoConstructor;
        
        function create(colId) { return this.manager.createEntity(entityName, {colloquiumId:colId}); }
        
        function getById(id, forceRemote) {
            return this._getById(entityName, id, forceRemote);
        }

        function getSessionsByColloquiumId(colloquiumId,forceRemote) {
            var self = this;
            var manager = self.manager;
            var predicate = Predicate.create('colloquiumId', 'eq', colloquiumId);
            var sessions;
            if (self._areItemsLoaded() && !forceRemote) {
                sessions = self._getAllLocal('Sessions', orderBy, predicate);
                self.log('Retrieved ' + sessions.length + ' elements from cache for entity type:' + entityName + '.', null, true);
                return $q.when(sessions);
            }
            return EntityQuery.from("Sessions")
                .expand("applicationUser")
                 .where(predicate)
                 .orderBy(orderBy)
                 .toType(entityName)
                 .using(manager)
                 .execute()
                 .then(success)
                 .catch(this._fail);

            function success(data) {
                sessions = data.results;
                if (!sessions) {
                    self.log('Couldnt find [' + entityName + '] for colloquiumId:' + colloquiumId, null, true);
                    return null;
                }
                self._areItemsLoaded(true);
                self.log('Retrieved ' + sessions.length + ' elements from server for entity type:' + entityName + '.', null, true);
                return sessions;
            }

        }

    }
})();