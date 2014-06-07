(function () {
    'use strict';

    // Module name is handy for logging
    var id = 'app';

    // Create the module and define its dependencies.
    var app = angular.module('app', [
        // Angular modules 
        'ngAnimate',        // animations
       // 'ngRoute',        // routing
        'ngSanitize',
        

        // Custom modules 
        'common',
        'common.bootstrap',

        // 3rd Party Modules
        'ui.bootstrap',
        'breeze.angular',
        'breeze.directives'
    ]);

    // Execute bootstrapping code and any dependencies.
    app.run(['$q', '$rootScope',
        function ($q, $rootScope) {

        }]);
})();