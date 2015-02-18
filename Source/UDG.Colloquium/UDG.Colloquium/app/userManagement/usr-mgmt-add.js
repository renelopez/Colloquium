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
            template: '<a class="btn btn-info btn-margin" href="{{link}}"><i class="glyphicon glyphicon-plus"></i><span> {{title}}</span></a>'

        };
        return directive;

        function link(scope, element, attrs) {
        }
    }

})();