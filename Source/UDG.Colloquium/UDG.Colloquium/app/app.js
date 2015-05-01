(function () {
    'use strict';

    // Module name is handy for logging
    var id = 'app';

    // Create the module and define its dependencies.
    var app = angular.module(id, [
        // Angular modules 
        'ngAnimate',        // animations
       // 'ngRoute',        // routing
        'ngSanitize',
        

        // Custom modules 
        'common',
        'common.bootstrap',

        // 3rd Party Modules
        'LocalStorageModule',
        'ui.router',
        'ui.bootstrap',
        'breeze.angular',
        'breeze.directives',
        'kendo.directives',
        'infinite-scroll'
    ]);

    // Execute bootstrapping code and any dependencies.
    app.run(['$q', '$rootScope','$state','authService','datacontext',
        function ($q, $rootScope,$state,authService,datacontext) {
            authService.fillAuthData();
        }]);
})();