(function() {
    'use strict';
    
    angular.module('app').directive('usrRegCollapsible', ['$window', '$animate', function ($window, $animate) {
        // Usage:
        // 
        // Creates:
        // 
        var directive = {
            link: link,
            restrict: 'E',
            replace: true,
            templateUrl: 'usr-reg-collapsible.html',
            controller: function ($scope) {
                $scope.visible = false;
                $scope.toggleVisibility = function () {
                    $scope.visible = !$scope.visible;
                }
            },
            scope: {
                title: "@",
                titleRemove: "@",
                removeMethod: "&",
            },
            transclude: true
        };
        return directive;

        function link(scope, element, attrs) {
        }
    }]);
})();