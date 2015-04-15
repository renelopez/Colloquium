(function() {
    'use strict';

    angular
        .module('app')
        .directive('usrMgmtCancel', usrMgmtCancel);

    
    function usrMgmtCancel () {
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
            template: '<button kendo-button class="btn btn-info btn-margin" ng-click="action()" ng-disabled="visibility"><i class="glyphicon glyphicon-remove"></i>Cancel</button>'
        };
        return directive;

        function link(scope, element, attrs) {

        }
    }

})();