(function () {
    'use strict';

    var serviceId = 'repository.role';

    angular.module('app').factory(serviceId, ['breeze','common','model', 'repository.abstract', repository]);

    function repository(breeze,common,model, AbstractRepository) {
        var EntityQuery = breeze.EntityQuery;
        var entityName = model.entityNames.role;
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
        };

        AbstractRepository.extend(RepoConstructor);

        return RepoConstructor;

        function create() { return this.manager.createEntity(entityName); }

        function getAll(forceRemote) {
            var roles;
            var self = this;

            if (self._areItemsLoaded() && !forceRemote) {
                roles = self._getAllLocal('Roles', orderBy);
                return $q.when(roles);
            }


            return EntityQuery.from('Roles')
                .using(self.manager)
                .execute()
                .then(success)
                .catch(self._queryFailed);

            function success(data) {
                var results = data.results;
                self._areItemsLoaded(true);
                logSuccess("User roles were succesfully retrieved.", null, true);
                return results;
            }
        }
    }
})();