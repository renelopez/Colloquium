(function() {
    'use strict';

    angular
        .module('app')
        .directive('usrMgmtRefresh', usrMgmtRefresh);

    
    function usrMgmtRefresh() {
        // Usage:
        //     <usr_mgmt_refresh></usr_mgmt_refresh>
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'E',
            scope: {
                action:'&'
            },
            templateUrl:'/app/userManagement/usr-mgmt-refresh.html'
        };
        return directive;

        function link(scope, element, attrs) {

        }
    }

})();