(function() {
    'use strict';

    var app = angular.module('app');
    app.config(['$stateProvider', '$urlRouterProvider', routeConfigurator]);

    function routeConfigurator($stateProvider, $urlRouterProvider) {
        // Creation
        $stateProvider
            .state('register', {
                url: '/register',
                templateUrl: '/app/userManagement/usrMgmt.html',
                controller: 'usrMgmtCtrl as vm'
            })
            .state('register.credentials', {
                url: '/credentials',
                templateUrl: '/app/userManagement/usrMgmtCredentials.html'
            })
            .state('register.personal', {
                url: '/personal',
                templateUrl: '/app/userManagement/usrMgmtPersonal.html'
            })
            .state('register.work', {
                url: '/work',
                templateUrl: '/app/userManagement/usrMgmtWork.html'
            })
            .state('register.contact', {
                url: '/contact',
                templateUrl: '/app/userManagement/usrMgmtContact.html'
            })
            .state('register.submit', {
                url: '/submit',
                templateUrl: '/app/userManagement/usrMgmtSubmit.html'
            })
        
            // Update
            .state('edit', {
                url: '/edit/:userId',
                templateUrl: '/app/userManagement/usrMgmt.html',
                controller: 'usrMgmtCtrl as vm'
            })
            .state('edit.credentials', {
                url: '/credentials',
                templateUrl: '/app/userManagement/usrMgmtCredentials.html',
            })
            .state('edit.personal', {
                url: '/personal',
                templateUrl: '/app/userManagement/usrMgmtPersonal.html'
            })
            .state('edit.work', {
                url: '/work',
                templateUrl: '/app/userManagement/usrMgmtWork.html'
            })
            .state('edit.contact', {
                url: '/contact',
                templateUrl: '/app/userManagement/usrMgmtContact.html'
            })
            .state('edit.submit', {
                url: '/submit',
                templateUrl: '/app/userManagement/usrMgmtSubmit.html'
            })
            .state('colloquiumList', {
                url: '/colloquiums',
                templateUrl: '/app/colloquium/colloquiums.html',
                controller: 'colloquiumsCtrl as vm'
            })
            .state('colloquiumDetail', {
                url: '/colloquiums/:colloquiumId',
                templateUrl: '/app/colloquium/colloquiumDetail.html',
                controller: 'colloquiumDetailCtrl as vm'
            
    });
        
        $urlRouterProvider.otherwise('/register/credentials');
    }
})();