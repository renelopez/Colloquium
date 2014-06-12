(function() {
    'use strict';

    var app = angular.module('formApp');
    app.config(['$stateProvider', '$urlRouterProvider', routeConfigurator]);
    
    function routeConfigurator($stateProvider, $urlRouterProvider) {
        $stateProvider.state('register', {
            url: '/register',
            templateUrl: '/app/register/register.html',
            controller: 'registerController as vm'
        })        
            .state('register.credentials', {
                url: '/credentials',
                templateUrl: '/app/register/register-credentials.html'
            })        
            .state('register.personal', {
                url: '/personal',
                templateUrl: '/app/register/register-personal.html'
            })        
            .state('register.work', {
                url: '/work',
                templateUrl: '/app/register/register-work.html'
            })        
            .state('register.contact', {
                url: '/contact',
                templateUrl: '/app/register/register-contact.html'
            });
        $urlRouterProvider.otherwise('/register/credentials');
    }
})();