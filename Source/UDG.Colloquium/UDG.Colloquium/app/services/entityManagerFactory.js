(function () {
    'use strict';

    var serviceId = 'entityManagerFactory';
    angular.module('app').factory(serviceId, ['breeze','$q', 'config','modelService', entityManagerFactory]);

    function entityManagerFactory(breeze,$q,config,modelService) {
        // Convert server-side PascalCase to client-side camelCase property names
        breeze.NamingConvention.camelCase.setAsDefault();
        
        // Do not validate when we attach a newly created entity to an EntityManager.
        // We could also set this per entityManager
        new breeze.ValidationOptions({ validateOnAttach: false }).setAsDefault();

        //var serviceName = config.remoteServiceName;
        //var metadataStore = new breeze.MetadataStore();
        var token = angular.element("#accessToken").val().replace(/"/g, "");;

        var ajaxAdapter = breeze.config.getAdapterInstance('ajax');
        ajaxAdapter.defaultSettings = {
            headers: {
                'Authorization':'Bearer '+ token
            }
        };
        

        var manager;

        var provider = {
            //metadataStore: metadataStore,
            getEntityManager: getEntityManager
        };

        return provider;

        function getEntityManager() {
          if (manager) {
              return $q.when(manager);
          } else {
              var dataService = new breeze.DataService({
                  hasServerMetadata: config.hasServerMetadata,
                  serviceName: config.remoteServiceName
              });

              manager = new breeze.EntityManager({ dataService: dataService });
              return modelService.setModel(manager);
          }
        }
    }
})();