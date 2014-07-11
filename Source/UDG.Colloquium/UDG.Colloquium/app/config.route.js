(function() {
    'use strict';

    var app = angular.module('app');
    app.config(['$stateProvider', '$urlRouterProvider', routeConfigurator]);

    function routeConfigurator($stateProvider, $urlRouterProvider) {
        // Creation
        $stateProvider.state('register', {
            url: '/register',
            templateUrl: '/app/userManagement/register/usrRegister.html',
            controller: 'usrRegisterCtrl as vm'
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
            })
        
        // Update
        .state('edit', {
            url: '/edit/:userId',
            templateUrl: '/app/userManagement/edit/usrEdit.html',
            controller: 'usrEditCtrl as vm'
        })
            .state('edit.credentials', {
                url: '/credentials',
                templateUrl: '/app/userManagement/edit/usrEditCredentials.html',
             })
            .state('edit.personal', {
                url: '/personal',
                templateUrl: '/app/userManagement/edit/usrEditPersonal.html'
            })
            .state('edit.work', {
                url: '/work',
                templateUrl: '/app/userManagement/edit/usrEditWork.html'
            })
            .state('edit.contact', {
                url: '/contact',
                templateUrl: '/app/userManagement/edit/usrEditContact.html'
            })
            .state('edit.submit', {
                url: '/submit',
                templateUrl: '/app/userManagement/edit/usrEditSubmit.html'
            });
        
        $urlRouterProvider.otherwise('/register/credentials');
    }
})();