(function () {
    'use strict';

    // Module name is handy for logging
    var id = 'workModule';

    // Create the module and define its dependencies.
    var workModule = angular.module('workModule', [
        // Angular modules 
        'ngAnimate',        // animations
        'ngRoute'           // routing

        // Custom modules 

        // 3rd Party Modules
        
    ]);

    // Execute bootstrapping code and any dependencies.
    workModule.run(['$q', '$rootScope',
        function ($q, $rootScope) {

        }]);
})();