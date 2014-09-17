(function () {
    'use strict';

    var serviceId = 'repository.urole';

    angular.module('app').factory(serviceId, ['breeze','model','repository.abstract', repository]);

    function repository(breeze,model, AbstractRepository) {
        var EntityQuery = breeze.EntityQuery;
        var entityName = model.entityNames.userRole;

        function RepoConstructor(manager) {
            this.serviceId = serviceId;
            this.entityName = entityName;
            this.manager = manager;
            // Data Access
            this.create = create;
        };

        AbstractRepository.extend(RepoConstructor);

        return RepoConstructor;
        
        function create(userId, roleId) {
            return this.manager.createEntity("ApplicationUserRole", {
                userId: userId,
                roleId: roleId,
            });
        }
    }
})();