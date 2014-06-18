(function() {
    'use strict';
    angular.module('app').factory('modelService', ['common', 'breeze', modelService]);
    
    function modelService(common,breeze) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logInfo = getLogFn(controllerId, "info");
        var logSuccess = getLogFn(controllerId, 'success');
        var logError = getLogFn(controllerId, 'error');

        var model = {
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

})