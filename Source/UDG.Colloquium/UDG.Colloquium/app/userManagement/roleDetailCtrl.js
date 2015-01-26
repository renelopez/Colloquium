(function () {
    'use strict';
    var controllerId = 'roleDetailCtrl';

    angular
        .module('app')
        .controller(controllerId, roleDetailCtrl);

    roleDetailCtrl.$inject = ['$scope', '$stateParams', '$window', 'common', 'config', 'datacontext'];

    function roleDetailCtrl($scope,$stateParams,$window,common,config,datacontext) {
        /* jshint validthis:true */
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logInfo = getLogFn(controllerId, "info");
        var logSuccess = getLogFn(controllerId, 'success');
        var logError = getLogFn(controllerId, 'error');
        var roleId = $stateParams.roleId;

        var vm = this;
        vm.title = 'roleDetailCtrl';
        vm.hasChanges = false;
        vm.isSaving = false;
        vm.canSave = canSave;
        vm.cancel = cancel;
        vm.goBack = goBack;
        vm.role = {};
        vm.save = save;
        Object.defineProperty(vm, 'canSave', {
            get: canSave
        });

        activate();

        function activate() {
            common.toggleBusyMessage(true);
            onDestroy();
            onHasChanges();
            common.activateController([getRoleById(roleId)], controllerId).then(function() {

            });
        }

        function canSave() {
            return !vm.isSaving && vm.hasChanges;
        }

        function cancel() {
            datacontext.cancel();
            if (vm.role.entityAspect.entityState.isDetached()) {
                goBack();
            }
        }

        function getRoleById(id) {
            if (id === 'new') {
                vm.role = datacontext.role.create();
            } else {
                return datacontext.role.getById(id).then(function (role) {
                    vm.role = role;
                });
            }
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
            return datacontext.saveChanges()
               .then(function (saveResult) {
                   common.toggleBusyMessage(false);
                   vm.isSaving = false;
                   goBack();
               }, function (error) {
                   common.toggleBusyMessage(false);
                   vm.isSaving = false;
                   goBack();
               });
        }
    }
})();
