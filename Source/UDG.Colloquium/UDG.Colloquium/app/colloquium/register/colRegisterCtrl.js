(function () {
    'use strict';

    var controllerId = 'colRegisterCtrl';

    // TODO: replace app with your module name
    angular.module('app').controller(controllerId,
        ['$scope', colRegisterCtrl]);

    function colRegisterCtrl($scope) {
        var vm = this;

        vm.activate = activate;
        vm.title = 'colRegisterCtrl';

        function activate() { }
    }
})();
