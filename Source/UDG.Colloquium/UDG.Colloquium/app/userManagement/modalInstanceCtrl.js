(function () {
    'use strict';

    var controllerId = 'modalInstanceCtrl';

    angular
        .module('app')
        .controller(controllerId, modalInstanceCtrl);

    modalInstanceCtrl.$inject = ['$modalInstance','common','datacontext','role']; 

    function modalInstanceCtrl($modalInstance,common,datacontext,role) {
        /* jshint validthis:true */
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logInfo = getLogFn(controllerId, "info");
        var logSuccess = getLogFn(controllerId, 'success');
        var logError = getLogFn(controllerId, 'error');
        var vm = this;
        vm.role = role;
        vm.ok = ok;
        vm.cancel = cancel;

        activate();

        function activate() { }

        function ok() {
            datacontext.markDeleted(role);
            common.toggleBusyMessage(true);
            return datacontext.saveChanges()
                .then(function (saveResult) {
                    common.toggleBusyMessage(false);
                logInfo('Operation was completed succesfully', saveResult, true);
                $modalInstance.close();
            }, function (error) {
                common.toggleBusyMessage(false);
                logError('Operation was not completed', error, true);
                $modalInstance.close();
                });
        }

        function cancel() {
            logInfo('User canceled the operation');
            $modalInstance.dismiss('');
        }
    }
})();
