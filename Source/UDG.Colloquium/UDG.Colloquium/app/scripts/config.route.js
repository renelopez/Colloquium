(function() {
    'use strict';

    var app = angular.module('app');
    app.config(['$stateProvider', '$urlRouterProvider', routeConfigurator]);

    function routeConfigurator($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('index', {
                url: '/',
                templateUrl: 'scripts/home.html',
                controller: 'homeCtrl as vm'
            })
            .state('login', {
                url: '/login',
                templateUrl: 'scripts/authentication/login.html',
                controller: 'loginCtrl as vm'
            })
            .state('about', {
                url: '/about',
                templateUrl: 'scripts/others/about.html'
            })
            .state('contact', {
                url: '/contact',
                templateUrl: 'scripts/others/contact.html'
            })
            .state('userManagement', {
                url: '/management/user',
                templateUrl: 'scripts/userManagement/usrMgmt.html',
                controller: 'usrMgmtCtrl as vm',
                resolve: {
                    checkMetadata:function(authService) {
                        return authService.checkIsLogged();
                    }   
                }
            })
            .state('userRoles', {
                url: '/management/userRoles/:userId',
                templateUrl: 'scripts/userManagement/usrRoleDetail.html',
                controller: 'usrRoleDetailCtrl as vm',
                resolve: {
                    checkMetadata: function (authService) {
                        return authService.checkIsLogged();
                    }
                }
            })
            .state('roleManagement', {
                url: '/management/role',
                templateUrl: 'scripts/userManagement/roleMgmt.html',
                controller: 'roleMgmtCtrl as vm',
                resolve: {
                    checkMetadata: function (authService) {
                        return authService.checkIsLogged();
                    }
                }
            })
            .state('roleDetail', {
                url: '/management/role/:roleId',
                templateUrl: 'scripts/userManagement/roleDetail.html',
                controller: 'roleDetailCtrl as vm',
                resolve: {
                    checkMetadata: function (authService) {
                        return authService.checkIsLogged();
                    }
                }
            })
             .state('session', {
                 url: '/sessions',
                 templateUrl: 'scripts/sessions/sessions.html',
                 controller: 'sessionsCtrl as vm',
                 resolve: {
                     checkMetadata: function (authService) {
                         return authService.checkIsLogged();
                     }
                 }
             })
              .state('sessionDetail', {
                  url: '/sessions/:sessionId',
                  templateUrl: 'scripts/sessions/sessionDetail.html',
                  controller: 'sessionDetailCtrl as vm',
                  resolve: {
                      checkMetadata: function (authService) {
                          return authService.checkIsLogged();
                      }
                  }
              })
            .state('sessionComments', {
                url: '/sessions/:sessionId/comments',
                templateUrl: 'scripts/comments/comments.html',
                controller: 'commentsCtrl as vm',
                resolve: {
                    checkMetadata: function (authService) {
                        return authService.checkIsLogged();
                    }
                }
            })
            // Creation
            .state('register', {
                url: '/register',
                templateUrl: 'scripts/userManagement/usrReg.html',
                controller: 'usrRegCtrl as vm',
                resolve: {
                    checkMetadata: function (authService) {
                        return authService.checkIsLogged();
                    }
                }
            })
            .state('register.credentials', {
                url: '/credentials',
                templateUrl: 'scripts/userManagement/usrRegCredentials.html'
            })
            .state('register.personal', {
                url: '/personal',
                templateUrl: 'scripts/userManagement/usrRegPersonal.html'
            })
            .state('register.work', {
                url: '/work',
                templateUrl: 'scripts/userManagement/usrRegWork.html'
            })
            .state('register.contact', {
                url: '/contact',
                templateUrl: 'scripts/userManagement/usrRegContact.html'
            })
            .state('register.submit', {
                url: '/submit',
                templateUrl: 'scripts/userManagement/usrRegSubmit.html'
            })
        
            // Update
            .state('edit', {
                url: '/edit/:userId',
                templateUrl: 'scripts/userManagement/usrReg.html',
                controller: 'usrRegCtrl as vm',
                resolve: {
                    checkMetadata: function (authService) {
                        return authService.checkIsLogged();
                    }
                }
            })
            .state('edit.credentials', {
                url: '/credentials',
                templateUrl: 'scripts/userManagement/usrRegCredentials.html'
            })
            .state('edit.personal', {
                url: '/personal',
                templateUrl: 'scripts/userManagement/usrRegPersonal.html'
            })
            .state('edit.work', {
                url: '/work',
                templateUrl: 'scripts/userManagement/usrRegWork.html'
            })
            .state('edit.contact', {
                url: '/contact',
                templateUrl: 'scripts/userManagement/usrRegContact.html'
            })
            .state('edit.submit', {
                url: '/submit',
                templateUrl: 'scripts/userManagement/usrRegSubmit.html'
            })
            .state('colloquiumList', {
                url: '/colloquiums',
                templateUrl: 'scripts/colloquium/colloquiums.html',
                controller: 'colloquiumsCtrl as vm',
                resolve: {
                    checkMetadata: function (authService) {
                        return authService.checkIsLogged();
                    }
                }
            })
            .state('colloquiumDetail', {
                url: '/colloquiums/:colloquiumId',
                templateUrl: 'scripts/colloquium/colloquiumDetail.html',
                controller: 'colloquiumDetailCtrl as vm',
                resolve: {
                    checkMetadata: function (authService) {
                        return authService.checkIsLogged();
                    }
                }
            })
            .state('colloquiumSessions', {
                url: '/colloquiums/:colloquiumId/sessions',
                templateUrl: 'scripts/colloquium/colloquiumSessions.html',
                controller: 'colloquiumSessionsCtrl as vm',
                resolve: {
                    checkMetadata: function (authService) {
                        return authService.checkIsLogged();
                    }
                }
            })
            .state('colloquiumSessionDetail', {
            url: '/colloquiums/:colloquiumId/sessions/:sessionId',
            templateUrl: 'scripts/colloquium/colloquiumSessionDetail.html',
            controller: 'colloquiumSessionDetailCtrl as vm',
            resolve: {
                checkMetadata: function (authService) {
                    return authService.checkIsLogged();
                }
            }
            })
           .state('colloquiumSessionComments', {
               url: '/colloquiums/:colloquiumId/sessions/:sessionId/comments',
                templateUrl: 'scripts/comments/comments.html',
                controller: 'commentsCtrl as vm',
                resolve: {
                    checkMetadata: function (authService) {
                        return authService.checkIsLogged();
                    }
                }
        
    });
        
        $urlRouterProvider.otherwise('/');
    }
})();