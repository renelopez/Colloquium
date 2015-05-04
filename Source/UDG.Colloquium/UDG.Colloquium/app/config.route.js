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
            .state('login', {
                url: '/login',
                templateUrl: '/app/authentication/login.html',
                controller: 'loginCtrl as vm'
            })
            .state('about', {
                url: '/about',
                templateUrl: '/app/others/about.html'
            })
            .state('contact', {
                url: '/contact',
                templateUrl: '/app/others/contact.html'
            })
            .state('userManagement', {
                url: '/management/user',
                templateUrl: '/app/userManagement/usrMgmt.html',
                controller: 'usrMgmtCtrl as vm',
                resolve: {
                    checkMetadata:function(authService) {
                        return authService.checkIsLogged();
                    }   
                }
            })
            .state('userRoles', {
                url: '/management/userRoles/:userId',
                templateUrl: '/app/userManagement/usrRoleDetail.html',
                controller: 'usrRoleDetailCtrl as vm',
                resolve: {
                    checkMetadata: function (authService) {
                        return authService.checkIsLogged();
                    }
                }
            })
            .state('roleManagement', {
                url: '/management/role',
                templateUrl: '/app/userManagement/roleMgmt.html',
                controller: 'roleMgmtCtrl as vm',
                resolve: {
                    checkMetadata: function (authService) {
                        return authService.checkIsLogged();
                    }
                }
            })
            .state('roleDetail', {
                url: '/management/role/:roleId',
                templateUrl: '/app/userManagement/roleDetail.html',
                controller: 'roleDetailCtrl as vm',
                resolve: {
                    checkMetadata: function (authService) {
                        return authService.checkIsLogged();
                    }
                }
            })
             .state('session', {
                 url: '/sessions',
                 templateUrl: '/app/sessions/sessions.html',
                 controller: 'sessionsCtrl as vm',
                 resolve: {
                     checkMetadata: function (authService) {
                         return authService.checkIsLogged();
                     }
                 }
             })
              .state('sessionDetail', {
                  url: '/sessions/:sessionId',
                  templateUrl: '/app/sessions/sessionDetail.html',
                  controller: 'sessionDetailCtrl as vm',
                  resolve: {
                      checkMetadata: function (authService) {
                          return authService.checkIsLogged();
                      }
                  }
              })
            .state('sessionComments', {
                url: '/sessions/:sessionId/comments',
                templateUrl: '/app/comments/comments.html',
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
                templateUrl: '/app/userManagement/usrReg.html',
                controller: 'usrRegCtrl as vm',
                resolve: {
                    checkMetadata: function (authService) {
                        return authService.checkIsLogged();
                    }
                }
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
                controller: 'usrRegCtrl as vm',
                resolve: {
                    checkMetadata: function (authService) {
                        return authService.checkIsLogged();
                    }
                }
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
                controller: 'colloquiumsCtrl as vm',
                resolve: {
                    checkMetadata: function (authService) {
                        return authService.checkIsLogged();
                    }
                }
            })
            .state('colloquiumDetail', {
                url: '/colloquiums/:colloquiumId',
                templateUrl: '/app/colloquium/colloquiumDetail.html',
                controller: 'colloquiumDetailCtrl as vm',
                resolve: {
                    checkMetadata: function (authService) {
                        return authService.checkIsLogged();
                    }
                }
            })
            .state('colloquiumSessions', {
                url: '/colloquiums/:colloquiumId/sessions',
                templateUrl: '/app/colloquium/colloquiumSessions.html',
                controller: 'colloquiumSessionsCtrl as vm',
                resolve: {
                    checkMetadata: function (authService) {
                        return authService.checkIsLogged();
                    }
                }
            })
            .state('colloquiumSessionDetail', {
            url: '/colloquiums/:colloquiumId/sessions/:sessionId',
            templateUrl: '/app/colloquium/colloquiumSessionDetail.html',
            controller: 'colloquiumSessionDetailCtrl as vm',
            resolve: {
                checkMetadata: function (authService) {
                    return authService.checkIsLogged();
                }
            }
            })
           .state('colloquiumSessionComments', {
               url: '/colloquiums/:colloquiumId/sessions/:sessionId/comments',
                templateUrl: '/app/comments/comments.html',
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