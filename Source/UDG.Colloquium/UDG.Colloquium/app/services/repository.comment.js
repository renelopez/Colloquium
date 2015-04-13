(function () {
    'use strict';

    var serviceId = 'repository.comment';

    angular.module('app').factory(serviceId, ['breeze','model','repository.abstract', repository]);

    function repository(breeze,model, AbstractRepository) {
        var EntityQuery = breeze.EntityQuery;
        var entityName = model.entityNames.comment;

        function RepoConstructor(manager) {
            this.serviceId = serviceId;
            this.entityName = entityName;
            this.manager = manager;
            // Data Access
            this.create = create;
        };

        AbstractRepository.extend(RepoConstructor);

        return RepoConstructor;
        
        function create(author,text,sessionId) {
             return this.manager.createEntity(entityName, {author:author,text:text,sessionId:sessionId,isActive:true});
        }
        
    }
})();