(function() {
    'use strict';

    angular
        .module('app')
        .directive('usrMgmtBack', usrMgmtBack);
    
    function usrMgmtBack () {
        // Usage:
        //     <usr_mgmt_back action='someActionThatGoesBack()'></usr_mgmt_back>
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'E',
            scope: {
                action:'&'
            },
            template:'<button class="btn btn-info btn-margin" ng-click="action()"><i class="glyphicon glyphicon-hand-left"></i>Back</button>'
        };
        return directive;

        function link(scope, element, attrs) {
        }
    }

})();