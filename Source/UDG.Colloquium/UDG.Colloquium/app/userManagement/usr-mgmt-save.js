(function() {
    'use strict';

    angular
        .module('app')
        .directive('usrMgmtSave', usrMgmtSave);

    
    function usrMgmtSave() {
        // Usage:
        //     <usr_mgmt_cancel></usr_mgmt_cancel>
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'E',
            scope: {
                action:'&',
                visibility:'='
            },
            templateUrl:'/app/userManagement/usr-mgmt-save.html'
        };
        return directive;

        function link(scope, element, attrs) {

        }
    }

})();