(function() {
    'use strict';

    angular
        .module('app')
        .directive('usrMgmtAdd', usrMgmtAdd);

    
    function usrMgmtAdd () {
        // Usage:
        //     <usr-mgmt-add></usr-mgmt-add>
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'E',
            scope: {
                link: '@',
                title:'@'
            },
            templateUrl:'app/userManagement/usr-mgmt-add.html'

        };
        return directive;

        function link(scope, element, attrs) {
        }
    }

})();