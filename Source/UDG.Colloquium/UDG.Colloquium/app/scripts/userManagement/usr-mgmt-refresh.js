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
                action: '&',
                title:'@'
            },
            template: '<button kendo-button class="btn btn-info btn-margin" ng-click="action()"><span class="k-icon k-i-refresh"></span> {{title}}</button>'
        };
        return directive;

        function link(scope, element, attrs) {

        }
    }

})();