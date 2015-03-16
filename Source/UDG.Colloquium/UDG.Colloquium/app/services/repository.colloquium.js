﻿(function () {
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
            this.getColloquiumSessionsFilteredCount = getColloquiumSessionsFilteredCount;
            this.getColloquiumSessionsCount = getColloquiumSessionsCount;
            this.getTypeaheadData = getTypeAheadData;
            this.getEntityByName = getEntityByName;
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

        function getSessionsByColloquiumId(colloquiumId,page,size,sessionFilter,forceRemote) {
            var self = this;
            var sessionEntityName = 'Session';
            var manager = self.manager;
            var predicate = _getFilterPredicate(colloquiumId);
            var session;
            var take = size || 10;
            var skip = page ? (page - 1) * size : 0;

            // TODO:Refactor this.
            if (!forceRemote) {
                session = manager.getEntityByKey(sessionEntityName, parseInt(colloquiumId));
                if (session && !session.isPartial) {
                    self.log('Retrieved ' + session.length + ' elements from cache for entity type:' + sessionEntityName + '.', null, true);
                    return $q.when(getByPage());
                }
            }
            return EntityQuery.from('Sessions')
                .expand('colloquium,applicationUser')
                 .where(predicate)
                 .orderBy('colloquium.period')
                 .toType(model.entityNames.session)
                 .using(manager)
                 .execute()
                 .then(success)
                 .catch(this._queryFailed);

            function getByPage() {
                var predicate;
                if (colloquiumId && sessionFilter) {
                    predicate = _getFilterPredicate(colloquiumId, sessionFilter);
                }
                var sessions = EntityQuery.from("Sessions")
                    .take(take)
                    .skip(skip)
                    .where(predicate)
                    .orderBy('colloquium.period')
                    .using(manager)
                    .executeLocally();
                return sessions;
            }

            function success(data) {
                if (!data.results) {
                    self.log('Couldnt find [' + entityName + '] for colloquiumId:' + colloquiumId, null, true);
                    return null;
                }
                colloquium.isPartial = false;
                self.log('Retrieved ' + data.results.length + ' elements from server for entity type:' + entityName + '.', null, true);
                return getByPage();
            }

        }

        function getColloquiumSessionsCount(colloquiumId) {
            var self = this;
            var manager = self.manager;
            var predicate = _getFilterPredicate(colloquiumId);
            var colloquium = manager.getEntityByKey(entityName, parseInt(colloquiumId));
            if (colloquium && !colloquium.isPartial) {
                return $q.when(_getLocalEntityCount(colloquiumId,"Sessions"));
            }

            return EntityQuery.from('Sessions')
                .expand('colloquium')
                .where(predicate)
                .using(manager)
                .execute()
                .then(_getInlineCount)
                .catch(this._queryFailed);

            function _getInlineCount(data) {
                return data.inlineCount;
            }
        }

        function _getLocalEntityCount(colloquiumId,entityName) {
            var predicate = _getFilterPredicate(id, search);
                var entities = EntityQuery.from(entityName)
                    .where(predicate)
                    .using(this.manager)
                    .executeLocally();
                return entities.length;
            }

        function getColloquiumSessionsFilteredCount(id, search) {
            var self = this;
            var manager = self.manager;
            var predicate = _getFilterPredicate(id,search);
            var query = EntityQuery.from('Sessions')
                    .where(predicate)
                    .using(manager)
                    .executeLocally();
                return $q.when(query.length);
                
        }

        function getEntityByName(period, forceRemote) {
            var self = this;
            var manager = self.manager;
            var predicate = Predicate.create('period', 'eq', period);
            var colloquium;


            if (!forceRemote) {
                colloquium = self._getAllLocal(entityName, orderBy, predicate)[0];
                if (colloquium && !colloquium.isPartial) {
                    self.log('Retrieved [' + entityName + '] id:' + colloquium.id + ' from cache.', colloquium, true);
                    if (colloquium.entityAspect.entityState.isDeleted()) {
                        colloquium = null; // hide session marked-for-delete
                    }
                    return $q.when(colloquium);
                }
            }
            return EntityQuery.from('Colloquiums')
                 .where(predicate)
                 .orderBy(orderBy)
                 .using(manager)
                 .execute()
                 .then(success)
                 .catch(this._fail);

            function success(data) {
                var results = data.results[0];
                if (!results) {
                    self.log('Couldnt find [' + entityName + '] name:' + colloquium, null, true);
                    return null;
                }
                results.isPartial = false;
                self.log('Retrieved [' + entityName + '] name:' + results.period+ ' from remote data source', results, true);
                return results;
            }
        }
        
        

        function getById(id, forceRemote) {
            return this._getById(entityName, id, forceRemote);
        }

        function _getFilterPredicate(id, filter) {
            if (filter) {
                return Predicate.create('colloquiumId', 'eq', id)
                    .and('name', 'contains', filter);
            }
            return Predicate.create('colloquiumId', 'eq', id);
        }

        function getTypeAheadData(col) {
            var self = this;
            var users;
            var predicate = Predicate.create('period', 'substringof', col);
            return EntityQuery.from("Colloquiums")
                 .where(predicate)
                 .select('period')
                 .orderBy(orderBy)
                 .using(self.manager)
                 .execute()
                 .then(success)
                 .catch(this._fail);

            function success(data) {
                return data.results;
            }
        }
    }
})();