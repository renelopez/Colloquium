(function () {
    'use strict';

    angular
        .module('app')
        .controller('roleDetailCtrl', roleDetailCtrl);

    roleDetailCtrl.$inject = ['$location', '$scope', '$stateParams', '$window', 'common', 'config', 'datacontext'];

    function roleDetailCtrl($location,$scope,$stateParams,$window,common,config,datacontext) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'roleDetailCtrl';

        activate();

        function activate() { }
    }
})();
