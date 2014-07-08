(function() {
    'use strict';

    var app = angular.module('app');
    app.config(['$stateProvider', '$urlRouterProvider', routeConfigurator]);

    function routeConfigurator($stateProvider, $urlRouterProvider) {
        $stateProvider.state('register', {
            url: '/register',
            templateUrl: '/app/userManagement/register/usrRegRegister.html',
            controller: 'usrRegRegisterCtrl as vm'
        })
            .state('register.credentials', {
                url: '/credentials',
                templateUrl: '/app/userManagement/register/usrRegCredentials.html'
            })
            .state('register.personal', {
                url: '/personal',
                templateUrl: '/app/userManagement/register/usrRegPersonal.html'
            })
            .state('register.work', {
                url: '/work',
                templateUrl: '/app/userManagement/register/usrRegWork.html'
            })
            .state('register.contact', {
                url: '/contact',
                templateUrl: '/app/userManagement/register/usrRegContact.html'
            })
            .state('register.submit', {
                url: '/submit',
                templateUrl: '/app/userManagement/register/usrRegSubmit.html'
            });
        $urlRouterProvider.otherwise('/register/credentials');
    }
})();