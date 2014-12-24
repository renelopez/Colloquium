(function () {
    'use strict';

    angular
        .module('app')
        .controller('indexCtrl', indexCtrl);

    function indexCtrl() {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'indexCtrl';

        activate();

        function activate() { }
    }
})();
