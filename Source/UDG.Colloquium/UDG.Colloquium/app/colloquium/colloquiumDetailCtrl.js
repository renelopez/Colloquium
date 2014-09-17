(function () {
    'use strict';

    var controllerId = 'colloquiumDetailCtrl';

    angular.module('app').controller(controllerId,
        ['$location','$scope','$stateParams','common','datacontext', colloquiumDetailCtrl]);

    function colloquiumDetailCtrl($location,$scope,$stateParams,common,datacontext) {
        var vm = this;

        vm.cancel = cancel;
        vm.cycles = ['A','B'];
        vm.colloquium = undefined;
        vm.isSaving = false;
        vm.save = save;
        vm.years = [];

        Object.defineProperty(vm, 'canSave', {
            get: canSave
        });

        activate();

        function activate() {
            loadYears();
            onDestroy();
            common.activateController([getRequestedColloquium()], controllerId).then(function() {

            });
        }
        
        function cancel() {
            datacontext.cancel();
            if (vm.colloquium.entityAspect.entityState.isDetached()) {
                goToColloquiumsList();
            }
        }

        function canSave() {
            return !vm.isSaving;
        }
        function getRequestedColloquium() {
            var val = $stateParams.colloquiumId;
            if (val === 'new') {
                //TODO Define datacontext for colloquium
                return vm.colloquium = datacontext.colloquium.create();
            }

            return datacontext.colloquium.getById(val).then(function(col) {
                vm.colloquium = col;
            },function(error) {
                logError('Unable to get colloquium ' + val);
                goToColloquiumsList();
            });
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
            $scope.$on('destroy', function() {
                datacontext.cancel();
            });
        }
        
        function save() {
            if (!canSave()) { return $q.when(null); } // Must return a promise
            vm.isSaving = true;
            vm.colloquium.period = vm.year + vm.cycle;
            return datacontext.saveChanges()
                .then(function (saveResult) {
                    vm.isSaving = false;
                }, function (error) {
                    vm.isSaving = false;
                });
        }

    }
})();
