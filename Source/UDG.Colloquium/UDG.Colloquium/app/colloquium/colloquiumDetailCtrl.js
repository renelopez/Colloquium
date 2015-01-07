(function () {
    'use strict';

    var controllerId = 'colloquiumDetailCtrl';

    angular.module('app').controller(controllerId,
        ['$location','$scope','$stateParams','$window','common','config','datacontext', colloquiumDetailCtrl]);

    function colloquiumDetailCtrl($location,$scope,$stateParams,$window,common,config,datacontext) {
        var vm = this;

        vm.cancel = cancel;
        vm.cycles = ['A','B'];
        vm.colloquium = undefined;
        vm.goBack = goBack;
        vm.hasChanges = false;
        vm.isSaving = false;
        vm.save = save;
        vm.updatePeriod = updatePeriod;
        vm.years = [];

        Object.defineProperty(vm, 'canSave', {
            get: canSave
        });

        activate();

        function activate() {
            common.toggleBusyMessage(true);
            loadYears();
            onDestroy();
            onHasChanges();
            common.activateController([getRequestedColloquium()], controllerId).then(function() {

            });
        }
        
        function updatePeriod() {
            vm.colloquium.period = vm.year + vm.cycle;
        }
        
        function cancel() {
            datacontext.cancel();
            vm.year = vm.colloquium.period.substring(0, 4);
            vm.cycle = vm.colloquium.period.slice(-1);
            
            if (vm.colloquium.entityAspect.entityState.isDetached()) {
                goBack();
            }
        }

        function canSave() {
            return !vm.isSaving && vm.hasChanges;
        }
        
        function getRequestedColloquium() {
            var val = $stateParams.colloquiumId;
            if (val === 'new') {
                return vm.colloquium = datacontext.colloquium.create();
            }

            return datacontext.colloquium.getById(val).then(function(col) {
                vm.colloquium = col;
                vm.year = col.period.substring(0, 4);
                vm.cycle = col.period.slice(-1);
            }, function (error) {
                toggleBusyMessage(false);
                logError('Unable to get colloquium ' + val);
                goToColloquiumsList();
            });
        }
        
        function goBack() {
            $window.history.back();
        }
        
        function goToColloquiumsList() {
            $location.path('/colloquiums');
        }
        
        function loadYears() {
            for (var i = new Date().getFullYear() ; i > 1900; i--) {
                vm.years.push(i.toString());
            }
        }
        
        function onDestroy() {
            $scope.$on('$destroy', function() {
                datacontext.cancel();
            });
        }
        
        function onHasChanges() {
            $scope.$on(config.events.hasChangesChanged, function(event, data) {
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
