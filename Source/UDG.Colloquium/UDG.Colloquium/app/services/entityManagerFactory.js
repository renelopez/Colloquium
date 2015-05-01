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
        
        var ajaxAdapter = breeze.config.getAdapterInstance('ajax');
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            ajaxAdapter.defaultSettings = {
                headers: {
                    'Authorization': 'Bearer ' + authData.token
                },
            };
        }

        var provider = {
            metadataStore: metadataStore,
            newManager: newManager
        };

        return provider;

        function createMetadataStore() {
            var store = new breeze.MetadataStore();
            model.configureMetadataStore(store);
            return store;
        }

        function newManager() {
            var mgr = new breeze.EntityManager({
                serviceName: serviceName,
                metadataStore: metadataStore
            });
            return mgr;
        }

        function responseError(rejection,textStatus,errorThrown) {
            if (rejection.status === 401) {
                $location.path('/login');
            }
            return $q.reject(rejection);
        }
    }
})();