(function () {
    'use strict';

    angular
        .module('app')
        .controller('loginCtrl', loginCtrl);

    loginCtrl.$inject = ['$location','authService','common'];

    function loginCtrl($location, authService, common) {
        /* jshint validthis:true */
        var vm = this;
        vm.login = login;
        vm.loginData = {
            username: "",
            password: "",
            rememberMe: false
        };

        vm.message = "";


        activate();

        function activate() {}

        function login() {
            common.toggleBusyMessage(true);
            return authService.login(vm.loginData).then(function(response) {
                common.toggleBusyMessage(false);
                $location.path('/');
            }, function(err) {
                common.toggleBusyMessage(false);
                vm.message = err.error_description;
            });
        }
    }
})();
