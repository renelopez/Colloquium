(function () {
    'use strict';

    angular
        .module('app')
        .controller('homeCtrl', homeCtrl);

    function homeCtrl() {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'homeCtrl';

        activate();

        function activate() { }
    }
})();
