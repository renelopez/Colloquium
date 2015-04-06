(function() {
    'use strict';

    var serviceId = 'datacontext';
    angular.module('app').factory(serviceId, ['breeze', 'common','config', 'entityManagerFactory','lodash','repositories','model', usrMgmtDatacontextSvc]);
    
    function usrMgmtDatacontextSvc(breeze, common,config,entityManagerFactory,lodash,repositories, model) {
        var $q = common.$q;

        var events = config.events;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, 'error');
        var logSuccess = getLogFn(serviceId, 'success');
        var entityNames = model.entityNames;
        var repoNames = ['colloquium','session','user', 'role','company','contact','urole','work','comment']; 
        var manager = entityManagerFactory.newManager();

        var service = {
            cancel:cancel,
            markDeleted:markDeleted,
            saveChanges:saveChanges,
        };

        init();

        return service;
        
        function init() {
            repositories.init(manager);
            defineLazyLoadedRepos();
            setupEventForHasChangesChanged();
        }
        
        function defineLazyLoadedRepos() {
            repoNames.forEach(function(repoName) {
                Object.defineProperty(service, repoName, {
                    configurable: true,
                    get: function() {
                        var repo = repositories.getRepo(repoName);
                        Object.defineProperty(service, repoName, {
                            value: repo,
                            configurable: false,
                            enumerable: true
                        });
                        return repo;
                    }
                });
            });
        }
        
       
        function cancel() {
            if (manager.hasChanges()) {
                manager.rejectChanges();
                logSuccess('Canceled changes', null, true);
            }
        }
        
        
        function markDeleted(entity) {
            entity.entityAspect.setDeleted();
        }
        
        function saveChanges() {
            return manager.saveChanges()
                    .catch(saveFailed)
                    .then(saveSuccess);
            
            function saveFailed(error) {
                var msg = "Save failed " + breeze.saveErrorMessageService.getErrorMessage(error);
                error.message = msg;
                logError(msg, error, true);
                throw error;
            }
            
            function saveSuccess(saveResult) {
                logSuccess("Changes were saved succesfully", saveResult, true);
            }
        }
        
        function setupEventForHasChangesChanged() {
            manager.hasChangesChanged.subscribe(function(eventArgs) {
                var data = { hasChanges: eventArgs.hasChanges };
                common.$broadcast(events.hasChangesChanged, data);
            });
        }
    }
}
)();

