﻿(function () {
    'use strict';

    var controllerId = 'shell';
    angular.module('app').controller(controllerId,
        ['$location','$rootScope', 'authService','common', 'config','$scope', shell]);

    function shell($location,$rootScope, authService,common, config,$scope) {
        var vm = this;
        var logSuccess = common.logger.getLogFn(controllerId, 'success');
        var events = config.events;

        vm.logOut = logOut;
        vm.authentication = authService.authentication;
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
            logSuccess('Colloquium Module loaded!', null, true);
            common.activateController([], controllerId);
        }

        function logOut() {
            authService.logOut();
            $location.path('/');
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

        $rootScope.$on(events.authorization,
            function (event, data) {
                console.log('inside the autorization event');
                if (!data.isAuthorized) {
                    logOut();
                }
            }
        );
    };
})();