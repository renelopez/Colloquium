(function() {
    'use strict';
    
    var factoryId = 'modelService';

    angular.module('app').factory(factoryId, ['common', 'breeze', modelService]);

    function modelService(common, breeze) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(factoryId);
        var logInfo = getLogFn(factoryId, "info");
        var logSuccess = getLogFn(factoryId, 'success');
        var logError = getLogFn(factoryId, 'error');

        var entityNames = {
            role: 'ApplicationRole',
            user: 'ApplicationUser'
        };

        var model = {
            entityNames:entityNames,
            setModel: setModel
        };
        return model;

        function setModel(manager) {
            return manager.metadataStore
                .fetchMetadata(manager.dataService)
                .then(function() { return manager; })
                .catch(metadataFetchFailed);
        }

        function metadataFetchFailed(error) {
            var err = 'Metadata fetch failed.\nIs the server running?';
            logError(err, error, true);
        }
    }

})();