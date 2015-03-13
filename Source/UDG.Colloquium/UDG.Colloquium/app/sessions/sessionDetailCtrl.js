(function () {
    'use strict';

    var controllerId = 'sessionDetailCtrl';

    angular.module('app').controller(controllerId,
        ['$scope', '$stateParams', '$window', 'common', 'config', 'datacontext', colloquiumSessionDetailCtrl]);

    function colloquiumSessionDetailCtrl($scope, $stateParams, $window, common, config, datacontext) {
        var vm = this;

        vm.cancel = cancel;
        vm.colloquiumId = $stateParams.colloquiumId;
        vm.getColloquiums = getColloquiums;
        vm.goBack = goBack;
        vm.hasChanges = false;
        vm.isSaving = false;
        vm.save = save;
        vm.selectedUser = undefined;
        vm.selectedColloquium = undefined;
        vm.session = undefined;
        vm.sessionId = $stateParams.sessionId;
        vm.users = [];
       

        Object.defineProperty(vm, 'canSave', {
            get: canSave
        });
        
        activate();

        function activate() {
            common.toggleBusyMessage(true);
            onDestroy();
            onHasChanges();
            common.activateController([getRequestedSession()], controllerId).then(function () {

            });
        }
        
        function canSave() {
            return !vm.isSaving && vm.hasChanges;
        }
        
        function cancel() {
            datacontext.cancel();
            if (vm.session.entityAspect.entityState.isDetached()) {
                goBack();
            }
        }
        
        function getRequestedSession() {
            if (vm.sessionId === 'new') {
                return vm.session = datacontext.session.create(vm.colloquiumId);
            }

            return datacontext.session.getById(vm.sessionId).then(function (session) {
                vm.session = session;
                vm.selectedUser = vm.session.applicationUser.firstName + " " + vm.session.applicationUser.lastName;
            }, function (error) {
                common.toggleBusyMessage(false);
                logError('Unable to get session ' + val);
                goBack();
            });
        }
        
        function getColloquiums(value) {
            return datacontext.colloquium.getTypeaheadData(value).then(function(colloquiums) {
                return colloquiums.map(function(period) {
                    return period;
                });
            });
        }

        
        function goBack() {
            $window.history.back();
        }
        
        function onDestroy() {
            $scope.$on('$destroy', function () {
                datacontext.cancel();
            });
        }
        
        function onHasChanges() {
            $scope.$on(config.events.hasChangesChanged, function (event, data) {
                vm.hasChanges = data.hasChanges;
            });
        }
        
         function save() {
             if (!canSave()) { return $q.when(null); } // Must return a promise
             vm.isSaving = true;
             common.toggleBusyMessage(true);
             datacontext.user.getEntityByName(vm.selectedUser).then(function(user) {
                 vm.session.applicationUser = user;
                 return datacontext.saveChanges()
                     .then(function(saveResult) {
                         vm.isSaving = false;
                         common.toggleBusyMessage(false);
                         goBack();
                 }, function(error) {
                     vm.isSaving = false;
                     common.toggleBusyMessage(false);
                         goBack();
                     });
             });
         }
        
    }
})();
