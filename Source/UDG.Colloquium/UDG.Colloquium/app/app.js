(function () {
    'use strict';

    // Module name is handy for logging
    var id = 'app';

    // Create the module and define its dependencies.
    var app = angular.module('app', [
        // Angular modules 
        'ngAnimate',        // animations
        'ngRoute'   ,        // routing

        // Custom modules 
        'registerModule'
        // 3rd Party Modules
        
    ]);

    // Execute bootstrapping code and any dependencies.
    app.run(['$q', '$rootScope',
        function ($q, $rootScope) {

        }]);
})();