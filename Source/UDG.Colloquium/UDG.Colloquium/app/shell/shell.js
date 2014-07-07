﻿(function () {
    'use strict';

    var controllerId = 'shell';
    angular.module('app').controller(controllerId,
        ['$rootScope', 'common', 'config','$scope', shell]);

    function shell($rootScope, common, config,$scope) {
        var vm = this;
        var logSuccess = common.logger.getLogFn(controllerId, 'success');
        var events = config.events;
        //$scope.spinnerObject = {
        //    busyMessage: 'Please wait ...',
        //    isBusy: true,
        //    spinnerOptions: {
        //        radius: 40,
        //        lines: 7,
        //        length: 0,
        //        width: 30,
        //        speed: 1.7,
        //        corners: 1.0,
        //        trail: 100,
        //        color: '#F58A00'
        //    }
        //};

        vm.busyMessage = 'Please wait ...';
        vm.isBusy = true,
        vm.spinnerOptions = {
            radius: 40,
            lines: 7,
            length: 0,
            width: 30,
            speed: 1.7,
            corners: 1.0,
            trail: 100,
            color: '#F58A00'
        };

        activate();

        function activate() {
            logSuccess('Register Module loaded!', null, true);
            common.activateController([], controllerId);
        }

        function toggleSpinner(on) {
             vm.isBusy = on;
        }

        $rootScope.$on('$routeChangeStart',
            function(event, next, current) {
                 toggleSpinner(true);
            }
        );

        $rootScope.$on(events.controllerActivateSuccess,
            function(event, data) {
                 toggleSpinner(false);
            }
        );

        $rootScope.$on(events.spinnerToggle,
            function(event, data) {
                 toggleSpinner(data.show);
            }
        );
    };
})();