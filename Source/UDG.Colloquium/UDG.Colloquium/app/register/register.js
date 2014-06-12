(function () {
    'use strict';

    var controllerId = 'registerController';

    angular.module('formApp').controller(controllerId,
        ['$scope','common', registerController]);

    function registerController($scope, common) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logInfo = getLogFn(controllerId, "info");
        var logSuccess = getLogFn(controllerId, 'success');

        var vm = this;
        vm.formData = {};
        vm.processForm = processForm;

        activate();

        
        function activate() {
            common.activateController([], controllerId).then(function() {
                log("Activated Register View");
            });
        }
        
        function processForm() {
            
        }
    }
})();
