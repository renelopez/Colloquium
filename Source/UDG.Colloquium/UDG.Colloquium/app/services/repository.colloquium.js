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
            this.getColloquiumsCount = getColloquiumsCount;
            this.getColloquiumsFilteredCount = getColloquiumsFilteredCount;
            this.getColloquiumSessionsFilteredCount = getColloquiumSessionsFilteredCount;
            this.getColloquiumSessionsCount = getColloquiumSessionsCount;
            this.getTypeaheadData = getTypeAheadData;
            this.getEntityByName = getEntityByName;
        };

        AbstractRepository.extend(RepoConstructor);

        return RepoConstructor;
        
        function create() { return this.manager.createEntity(entityName, {isActive:true}); }
        
        function getAll(page,size,filter,forceRemote) {
            var colloquiums;
            var mainPredicate = Predicate.create('isActive', 'eq', 'true');
            var selectFields = 'id,period,beginDate,endDate,isActive';
            var self = this;
            var take = size || 10;
            var skip = page ? (page - 1) * size:0;


            if (self._areItemsLoaded() && !forceRemote) {
                colloquiums = self._getAllLocal('Colloquiums', orderBy,mainPredicate);
                self.log('Retrieved '+ colloquiums.length +' elements from cache for entity type:' + entityName + '.',null,true);
                return $q.when(getColloquiumsByPage());
            }


            return EntityQuery.from('Colloquiums')
                .select(selectFields)
                .orderBy(orderBy)
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
                return getColloquiumsByPage();
            }

            function getColloquiumsByPage() {
                var predicate = filter ? _getColloquiumFilterPredicate(filter) : mainPredicate;

                return EntityQuery.from('Colloquiums')
                    .where(predicate)
                    .take(take)
                    .skip(skip)
                    .orderBy(orderBy)
                    .toType(entityName)
                    .using(self.manager)
                    .executeLocally();
            }
        }

        function getSessionsByColloquiumId(colloquiumId,page,size,sessionFilter,forceRemote) {
            var self = this;
            var sessionResource= 'Sessions';
            var sessionOrderBy = 'name';
            var manager = self.manager;
            var predicate = _getFilterPredicate(colloquiumId);
            var sessions;
            var take = size || 10;
            var skip = page ? (page - 1) * size : 0;

            if (!forceRemote) {
                sessions = self._getAllLocal(sessionResource,sessionOrderBy,predicate);
                if (sessions && sessions.length > 0) {
                    self.log('Retrieved ' + sessions.length + ' elements from cache for entity type:' + sessionResource + '.', null, true);
                    return $q.when(getSessionsByPage());
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

            function getSessionsByPage() {
                var predicate;
                if (colloquiumId){
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
                self.log('Retrieved ' + data.results.length + ' elements from server for entity type:' + entityName + '.', null, true);
                return getSessionsByPage();
            }

        }

        function getColloquiumsCount() {
            var self = this;
            var manager = self.manager;
            if (self._areItemsLoaded()) {
                return $q.when(self._getLocalCount('Colloquiums'));
            }

            return EntityQuery.from('Colloquiums')
                .where(predicate)
                .using(manager)
                .execute()
                .then(_getInlineCount)
                .catch(this._queryFailed);

            function _getInlineCount(data) {
                return data.inlineCount;
            }
        }

        function getColloquiumsFilteredCount(filter) {
            var predicate = _getColloquiumFilterPredicate(filter);
            var query = EntityQuery.from('Colloquiums')
                    .where(predicate)
                    .using(this.manager)
                    .executeLocally();
            return $q.when(query.length);
        }

        function getColloquiumSessionsCount(colloquiumId) {
            var self = this;
            var manager = self.manager;
            var predicate = _getFilterPredicate(colloquiumId);
            var colloquium = manager.getEntityByKey(entityName, parseInt(colloquiumId));
            if (colloquium && !colloquium.isPartial) {
                return $q.when(getLocalColloquiumSessionsCount(colloquiumId));
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

            function getLocalColloquiumSessionsCount() {

                var sessions = EntityQuery.from('Sessions')
                    .expand('colloquium')
                    .where(predicate)
                    .using(manager)
                    .executeLocally();
                return sessions.length;
            }
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
            var predicate = Predicate.create('period', 'eq', period).and('isActive','eq',true);
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
                    .and('name', 'contains', filter)
                    .and('isActive', 'eq', true);
            }
            return Predicate.create('colloquiumId', 'eq', id)
                            .and('isActive', 'eq', true);
        }

        function _getColloquiumFilterPredicate(filter) {
            return Predicate.create('period', 'contains', filter)
                .and('isActive', 'eq', true);
        }

        function getTypeAheadData(col) {
            var self = this;
            var users;
            var predicate = Predicate.create('period', 'substringof', col)
                                        .and('isActive', 'eq', true);
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