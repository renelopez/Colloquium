(function() {
    'use strict';

    var app = angular.module('app');
    app.config(['$stateProvider', '$urlRouterProvider', routeConfigurator]);

    function routeConfigurator($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('index', {
                url: '/',
                templateUrl: '/app/index.html',
                controller: 'indexCtrl as vm'
            })
            .state('management', {
                url: '/management/user',
                templateUrl: '/app/userManagement/usrMgmt.html',
                controller:'usrMgmtCtrl as vm'
            })

            // Creation
            .state('register', {
                url: '/register',
                templateUrl: '/app/userManagement/usrReg.html',
                controller: 'usrRegCtrl as vm'
            })
            .state('register.credentials', {
                url: '/credentials',
                templateUrl: '/app/userManagement/usrRegCredentials.html'
            })
            .state('register.personal', {
                url: '/personal',
                templateUrl: '/app/userManagement/usrRegPersonal.html'
            })
            .state('register.work', {
                url: '/work',
                templateUrl: '/app/userManagement/usrRegWork.html'
            })
            .state('register.contact', {
                url: '/contact',
                templateUrl: '/app/userManagement/usrRegContact.html'
            })
            .state('register.submit', {
                url: '/submit',
                templateUrl: '/app/userManagement/usrRegSubmit.html'
            })
        
            // Update
            .state('edit', {
                url: '/edit/:userId',
                templateUrl: '/app/userManagement/usrReg.html',
                controller: 'usrRegCtrl as vm'
            })
            .state('edit.credentials', {
                url: '/credentials',
                templateUrl: '/app/userManagement/usrRegCredentials.html'
            })
            .state('edit.personal', {
                url: '/personal',
                templateUrl: '/app/userManagement/usrRegPersonal.html'
            })
            .state('edit.work', {
                url: '/work',
                templateUrl: '/app/userManagement/usrRegWork.html'
            })
            .state('edit.contact', {
                url: '/contact',
                templateUrl: '/app/userManagement/usrRegContact.html'
            })
            .state('edit.submit', {
                url: '/submit',
                templateUrl: '/app/userManagement/usrRegSubmit.html'
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
            })
            .state('colloquiumSessions', {
                url: '/colloquiums/:colloquiumId/sessions',
                templateUrl: '/app/colloquium/colloquiumSessions.html',
                controller:'colloquiumSessionsCtrl as vm'
            })
            .state('colloquiumSessionDetails', {
                url: '/colloquiums/:colloquiumId/sessions/:sessionId',
                templateUrl: '/app/colloquium/colloquiumSessionDetail.html',
                controller: 'colloquiumSessionDetailCtrl as vm'
    });
        
        $urlRouterProvider.otherwise('/');
    }
})();