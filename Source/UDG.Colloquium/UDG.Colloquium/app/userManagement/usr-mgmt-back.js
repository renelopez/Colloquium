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
            templateUrl:'/app/userManagement/usr-mgmt-back.html'
        };
        return directive;

        function link(scope, element, attrs) {
        }
    }

})();