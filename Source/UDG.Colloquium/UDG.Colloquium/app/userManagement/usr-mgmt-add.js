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
            template: '<a kendo-button class="btn btn-info btn-margin" href="{{link}}"><span class="k-icon k-i-plus"></span> {{title}}</a>'

        };
        return directive;

        function link(scope, element, attrs) {
        }
    }

})();