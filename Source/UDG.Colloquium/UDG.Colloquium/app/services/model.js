(function() {
    'use strict';
    
    var factoryId = 'model';

    angular.module('app').factory(factoryId, ['common', model]);

    function model(common) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(factoryId);
        var logInfo = getLogFn(factoryId, "info");
        var logSuccess = getLogFn(factoryId, 'success');
        var logError = getLogFn(factoryId, 'error');

        var entityNames = {
            colloquium:'Colloquium',
            company:'Company',
            contact:'Contact',
            role: 'ApplicationRole',
            session:'Session',
            user: 'ApplicationUser',
            userRole: 'ApplicationUserRole',
            work: 'Work',
        };

        var service = {
            configureMetadataStore: configureMetadataStore,
            entityNames:entityNames
        };
        return service;

        function configureMetadataStore(metadataStore) {
            registerRangeDate(metadataStore);
        }
        
        function registerRangeDate(metadataStore) {
            metadataStore.registerEntityTypeCtor('Colloquium', Colloquium);
            
            function Colloquium() {
                this.isPartial = false;
            }

            Object.defineProperty(Colloquium.prototype, 'rangeDate', {                
               get:function() {
                   var startDate = this.startDate;
                   var endDate = this.endDate;
                   var value = 'From ' + moment.utc(startDate).format('MMM Do YYYY') + ' To ' + moment.utc(endDate).format('MMM Do YYYY');
                   return value;
               }
               
            });
        }
       
    }

})();