(function () {
    'use strict';

    angular
        .module('app')
        .controller('roleMgmtCtrl', roleMgmtCtrl);

    roleMgmtCtrl.$inject = ['$location']; 

    function roleMgmtCtrl($location) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'roleMgmtCtrl';

        activate();

        function activate() { }
    }
})();
