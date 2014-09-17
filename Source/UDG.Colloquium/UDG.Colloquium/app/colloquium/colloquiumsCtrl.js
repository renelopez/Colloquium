(function () {
    'use strict';

    var controllerId = 'colloquiumsCtrl';

    angular.module('app').controller(controllerId,
        ['common','config','datacontext', colloquiumsCtrl]);

    function colloquiumsCtrl(common,config,datacontext) {
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var keyCodes = config.keyCodes;

        var applyFilter = function() {};

        vm.colloquiums = [];
        vm.colloquiumsSearch = '';
        vm.colloquiumsFilter = colloquiumsFilter;
        vm.filteredColloquiums = [];
        //vm.goToColloquiumStudents = goToColloquiumStudents;
        vm.title = 'Colloquiums';
        vm.refresh = refresh;
        vm.search = search;
        
        activate();

        function activate() {
            common.activateController([getColloquiums()], controllerId).then(function() {
                applyFilter = common.createSearchThrottle(vm, 'colloquiums');
                if (vm.colloquiumsSearch) {
                    applyFilter(true);
                }
                log('Activated Colloquium View');
            });
        }
        
        function colloquiumsFilter(colloquium) {
            var textContains = common.textContains;
            var searchText = vm.colloquiumsSearch;
            var isMatch = searchText ? textContains(colloquium.period, searchText) : true;
            return isMatch;
        }
        
        function getColloquiums(forceRefresh) {
            return datacontext.colloquium.getAll(forceRefresh).then(function(cols) {
                vm.colloquiums = vm.filteredColloquiums = cols;
            });
        }
        
        function refresh() {
            getColloquiums(true);
        }
        
        function search($event) {
            if ($event.keyCode === keyCodes.esc) {
                vm.colloquiumsSearch = '';
                applyFilter(true);
            } else {
                applyFilter();
            }
        }
    }
})();
