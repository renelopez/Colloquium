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
            this.getAll = getAll;
            this.getById = getById;
            this.getNameById = getNameById;
            this.getSessionsFilteredCount = getSessionsFilteredCount;
            this.getComments = getComments;
            this.getSessionsCount = getSessionsCount;
        };

        AbstractRepository.extend(RepoConstructor);

        return RepoConstructor;
        
        function create(colId) { return this.manager.createEntity(entityName, {colloquiumId:colId,isActive:true}); }
        
        function getAll(page, size, filter, forceRemote) {
            var self = this;
            var take = size || 20;
            var skip = page ? (page - 1) * size : 0;
            if (self._areItemsLoaded() && !forceRemote) {
                return $q.when(getByPage());
            }

            return EntityQuery.from('Sessions')
                .expand('colloquium,applicationUser')
                .orderBy(self.orderBy)
                .toType(self.entityName)
                .using(self.manager)
                .execute()
                .then(success)
                .catch(self._queryFailed);

            function success(data) {
                if (!data.results) {
                    self.log('Couldnt find [' + entityName + '] for colloquiumId:' + colloquiumId, null, true);
                    return null;
                }
                self._areItemsLoaded(true);
                self._setIsPartialIsTrue(data.results);
                self.log('Retrieved ' + data.results.length + ' elements from server for entity type:' + entityName + '.', null, true);
                return getByPage();
            }

            function getByPage() {
                var predicate;
                if (filter) {
                    predicate = _getSessionFilterPredicate(filter);
                }
                return EntityQuery.from('Sessions')
                    .where(predicate)
                    .take(take)
                    .skip(skip)
                    .using(self.manager)
                    .executeLocally();
            }

        }

        function getComments(page,size,sessionId) {
            var self = this;
            var manager = self.manager;
            var take = size || 5;
            var skip = page ? (page - 1) * size : 0;

            //var workingSession = manager.getEntityByKey(entityName, sessionId);
            //if (workingSession && workingSession.areCommentsLoaded){
            //    return $q.when(getCommentsByPage());
            //}

            return EntityQuery.from('Comments')
                .expand('session')
                .where('session.id', 'eq', sessionId)
                .orderBy('commentId')
                .take(take)
                .skip(skip)
                .using(manager)
                .execute()
                .then(success)
                .catch(this._queryFailed);

            function success(data) {
                if (!data.results) {
                    self.log('Couldnt find [' + entityName + '] for SessionId:' + sessionId, null, true);
                    return null;
                }
              //  data.results[0].session.areCommentsLoaded = true;
                self.log('Retrieved ' + data.results.length + ' elements from server for entity type:' + entityName + '.', null, true);
                //return getCommentsByPage();
                return data.results;
            }

            function getCommentsByPage() {
                return EntityQuery.from('Comments')
                    .expand('session')
                    .where('session.id', 'eq', sessionId)
                    .take(take)
                    .skip(skip)
                    .using(manager)
                    .executeLocally();
            }
        }

        function getById(id, forceRemote) {
            return this._getById(entityName, id, forceRemote);
        }

        function getNameById(id, forceRemote) {
            var self = this;
            var manager = this.manager;
            var predicate = Predicate.create('id', 'eq', id);

            if (!forceRemote) {
                var entity = manager.getEntityByKey(entityName, id);
                if (entity) {
                    self.log('Retrieved [' + entityName + '] id:' + entity.id + ' from cache.', entity, true);
                    if (entity.entityAspect.entityState.isDeleted()) {
                        entity = null; // hide session marked-for-delete
                    }
                    return $q.when(self._getAllLocal('Sessions', orderBy, predicate)[0]);
                }
            }

            return EntityQuery.from('Sessions')
                .where(predicate)
                .select('name')
                .toType(entityName)
                .using(manager)
                .execute()
                .then(success)
                .catch(this._queryFailed);

            function success(data) {
                if (!data.results) {
                    self.log('Couldnt find [' + entityName + '] for SessionId:' + sessionId, null, true);
                    return null;
                }
                //  data.results[0].session.areCommentsLoaded = true;
                self.log('Retrieved ' + data.results.length + ' elements from server for entity type:' + entityName + '.', null, true);
                //return getCommentsByPage();
                return data.results;
            }


        }

        function getSessionsCount() {
            var self = this;
            var manager = self.manager;
            if (self._areItemsLoaded()) {
                return $q.when(_getLocalEntityCount("Sessions"));
            }

            return EntityQuery.from('Sessions')
                .using(manager)
                .execute()
                .then(_getInlineCount)
                .catch(this._queryFailed);

            function _getInlineCount(data) {
                return data.inlineCount;
            }

            function _getLocalEntityCount(entityName) {
                var entities = EntityQuery.from(entityName)
                    .using(manager)
                    .executeLocally();
                return entities.length;
            }
        }

        

        function getSessionsFilteredCount(filter) {
            var self = this;
            var manager = self.manager;
            var predicate = _getSessionFilterPredicate(filter);
            var query = EntityQuery.from('Sessions')
                    .where(predicate)
                    .using(manager)
                    .executeLocally();
            return $q.when(query.length);

        }

        function _getSessionFilterPredicate(filter) {
            return Predicate.create('name', 'contains', filter).and('isActive','eq',true);
        }

    }
})();