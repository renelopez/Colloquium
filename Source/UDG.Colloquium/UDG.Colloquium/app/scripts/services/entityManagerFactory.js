(function () {
    'use strict';

    var serviceId = 'entityManagerFactory';
    angular.module('app').factory(serviceId, ['$location', '$q', 'breeze', 'config', 'localStorageService', 'model', entityManagerFactory]);

    function entityManagerFactory($location, $q, breeze, config, localStorageService, model) {
        
        breeze.config.initializeAdapterInstance('modelLibrary', 'backingStore', true);
        
        // Convert server-side PascalCase to client-side camelCase property names
        breeze.NamingConvention.camelCase.setAsDefault();
        
        // Do not validate when we attach a newly created entity to an EntityManager.
        // We could also set this per entityManager
        new breeze.ValidationOptions({ validateOnAttach: false }).setAsDefault();

        var serviceName = config.remoteServiceName;
        var metadataStore = createMetadataStore();
        var manager;
        
       

        var provider = {
            configureAdapterInstance:configureAdapterInstance,
            getReady:getReady,
            metadataStore: metadataStore,
            newManager: newManager
        };

        return provider;

        function configureAdapterInstance() {
            var authData = localStorageService.get('authorizationData');
            var ajaxAdapter = breeze.config.getAdapterInstance('ajax');
            if (authData) {
                ajaxAdapter.defaultSettings = {
                    headers: {
                        'Authorization': 'Bearer ' + authData.token
                    },
                };
            } else {
                ajaxAdapter.defaultSettings = {};
            }
        }

        function createMetadataStore() {
            var store = new breeze.MetadataStore();
            model.configureMetadataStore(store);
            return store;
        }

        function getReady() {
            return metadataStore.fetchMetadata(manager.dataService)
                .then(function () {
                    logSuccess("Metadata Fetched");
                    return true;
                }).catch(function (error) {
                    logError("Metadata Fetch Failed! We got " + error.message, error, true);
                    return $q.reject(error);
                });
        }

        function newManager() {
            if (!manager)
                manager = new breeze.EntityManager({
                serviceName: serviceName,
                metadataStore: metadataStore
            });
            return manager;
        }
    }
})();