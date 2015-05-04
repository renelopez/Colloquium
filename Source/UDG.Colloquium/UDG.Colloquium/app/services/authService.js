(function () {
    'use strict';

    angular
        .module('app')
        .factory('authService', authService);

    authService.$inject = ['$http','$location','$q','entityManagerFactory','localStorageService'];

    function authService($http,$location, $q,entityManagerFactory, localStorageService) {

        var serviceBase = 'http://localhost:9000/';
        var authentication= {
            isAuth: false,
            username:''
        }

        var service = {
            authentication: authentication,
            checkIsLogged: checkIsLogged,
            fillAuthData: fillAuthData,
            login: login,
            logOut: logOut,
            saveRegistration: saveRegistration
        };

        return service;

        function checkIsLogged() {
            var authData = localStorageService.get('authorizationData');
            if (!authData) {
                logOut();
                return;
            }
            entityManagerFactory.configureAdapterInstance();
        }

        function fillAuthData() {
            var authData = localStorageService.get('authorizationData');
            if (authData) {
                if (!authData.rememberMe) {
                    logOut();
                    return;
                }
                authentication.isAuth = true;
                authentication.username = authData.username;
                entityManagerFactory.configureAdapterInstance();
            }
        }

        function login(loginData) {
            var data = 'grant_type=password&username=' + loginData.username + '&password=' + loginData.password;

            var deferred = $q.defer();

            $http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json' } }).success(function (response) {
                localStorageService.set('authorizationData', { token: response.access_token, username: loginData.username ,rememberMe:loginData.rememberMe});
                authentication.isAuth = true;
                authentication.username = loginData.username;
                entityManagerFactory.configureAdapterInstance();
                deferred.resolve(response);
            }).error(function(err, status) {
                logOut();
                deferred.reject(err);
            });
            return deferred.promise;
        }

        function logOut() {
            localStorageService.remove('authorizationData');
            authentication.isAuth = false;
            authentication.username = '';
            $location.path('/');
            entityManagerFactory.configureAdapterInstance();
        }

        // TODO Adapt this registration process to Breeze.
        function saveRegistration(registration) {
            logOut();
            return $http.post(serviceBase + 'api/account/register', registration).then(function(response) {
                return response;
            });
        }
    }
})();