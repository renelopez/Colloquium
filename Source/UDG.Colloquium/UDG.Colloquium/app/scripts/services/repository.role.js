(function () {
    'use strict';

    var serviceId = 'repository.role';

    angular.module('app').factory(serviceId, ['breeze','common','model', 'repository.abstract', repository]);

    function repository(breeze,common,model, AbstractRepository) {
        var EntityQuery = breeze.EntityQuery;
        var entityName = model.entityNames.role;
        var Predicate = breeze.Predicate;
        var orderBy = 'id';
        var $q = common.$q;
        
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);
        var logInfo = getLogFn(serviceId, "info");
        var logSuccess = getLogFn(serviceId, 'success');
        var logError = getLogFn(serviceId, 'error');

        function RepoConstructor(manager) {
            this.serviceId = serviceId;
            this.entityName = entityName;
            this.manager = manager;
            // Data Access
            this.create = create;
            this.getAll = getAll;
            this.getById = getById;
        };

        AbstractRepository.extend(RepoConstructor);

        return RepoConstructor;

        function create() { return this.manager.createEntity(entityName, {isActive:true}); }

        function getAll(forceRemote) {
            var roles;
            var self = this;
            var activePredicate = Predicate.create('isActive', 'eq', true);

            if (self._areItemsLoaded() && !forceRemote) {
                roles = self._getAllLocal('Roles', orderBy,activePredicate);
                return $q.when(roles);
            }


            return EntityQuery.from('Roles')
                .select('id,name,description,isActive')
                .where(activePredicate)
                .toType(self.entityName)
                .using(self.manager)
                .execute()
                .then(success)
                .catch(self._queryFailed);

            function success(data) {
                var results = data.results;
                roles = self._setIsPartialIsTrue(results);
                self._areItemsLoaded(true);
                logSuccess("User roles were succesfully retrieved.", null, true);
                return results;
            }
        }

        function getById(id, forceRemote) {
            return this._getById(this.entityName, id, forceRemote);
        }
    }
})();