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
            template: '<a class="btn btn-info btn-margin" ng-click="action()"><i class="glyphicon glyphicon-refresh"></i><span> Refresh</span></a>'
        };
        return directive;

        function link(scope, element, attrs) {

        }
    }

})();