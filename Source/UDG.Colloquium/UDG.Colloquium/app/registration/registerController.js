(function () {
    'use strict';

    var controllerId = 'registerController';

    // TODO: replace app with your module name
    angular.module('app').controller(controllerId,
        ['$scope', registerController]);

    function registerController($scope) {
        var vm = this;

        vm.activate = activate;
        vm.title = 'registerController';

        function activate() { }
    }
})();
