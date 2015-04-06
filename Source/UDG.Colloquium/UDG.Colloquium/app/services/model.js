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
            colloquium: 'Colloquium',
            comment:'Comment',
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
            registerColloquium(metadataStore);
            registerUser(metadataStore);
        }
        
        function registerColloquium(metadataStore) {
            metadataStore.registerEntityTypeCtor(entityNames.colloquium, Colloquium);
            
            function Colloquium() {
                this.isPartial = false;
            }

            Object.defineProperty(Colloquium.prototype, 'rangeDate', {                
               get:function() {
                   var beginDate = this.beginDate;
                   var endDate = this.endDate;
                   var value = 'From ' + moment.utc(beginDate).format('MMM Do YYYY') + ' To ' + moment.utc(endDate).format('MMM Do YYYY');
                   return value;
               }
               
            });
        }

        function registerUser(metadataStore) {
            metadataStore.registerEntityTypeCtor(entityNames.user, ApplicationUser);

            function ApplicationUser() {
                this.isPartial = false;
            }

            Object.defineProperty(ApplicationUser.prototype, 'fullName', {
                get:function() {
                    var firstName = this.firstName;
                    var lastName = this.lastName;
                    return firstName + " " + lastName;
                }
            });

        }
       
    }

})();