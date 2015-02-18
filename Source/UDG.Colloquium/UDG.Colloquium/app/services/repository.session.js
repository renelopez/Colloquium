﻿(function () {
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
        };

        AbstractRepository.extend(RepoConstructor);

        return RepoConstructor;
        
        function create(colId) { return this.manager.createEntity(entityName, {colloquiumId:colId}); }
        
        function getById(id, forceRemote) {
            return this._getById(entityName, id, forceRemote);
        }

        

    }
})();