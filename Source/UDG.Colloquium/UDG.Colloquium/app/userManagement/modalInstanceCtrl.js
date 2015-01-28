(function () {
    'use strict';

    angular
        .module('app')
        .controller('modalInstanceCtrl', modalInstanceCtrl);

    modalInstanceCtrl.$inject = ['$modalInstance','datacontext','role']; 

    function modalInstanceCtrl($modalInstance,datacontext,role) {
        /* jshint validthis:true */
        var vm = this;
        vm.role = role;
        vm.ok = ok;
        vm.cancel = cancel;

        activate();

        function activate() { }

        function ok() {
            datacontext.markDeleted(role);
            $modalInstance.close();
        }

        function cancel() {
            $modalInstance.dismiss();
        }
    }
})();
