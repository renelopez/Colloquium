(function () {
    'use strict';

    angular
        .module('app')
        .controller('loginCtrl', loginCtrl);

    loginCtrl.$inject = ['$location','authService']; 

    function loginCtrl($location,authService) {
        /* jshint validthis:true */
        var vm = this;
        vm.login = login;
        vm.loginData = {
            username: "",
            password: ""
        };

        vm.message = "";


        activate();

        function activate() { }

        function login() {
            authService.login(vm.loginData).then(function(response) {
                $location.path('/');
            },function(err) {
                vm.message = err.error_description;
            });
        }
    }
})();
