(function () {
    'use strict';

    var controllerId = 'commentsCtrl';

    angular.module('app').controller(controllerId,
        ['$q','$scope', '$stateParams', '$window', 'common', 'config', 'datacontext', colloquiumSessionDetailCtrl]);

    function colloquiumSessionDetailCtrl($q,$scope, $stateParams, $window, common, config, datacontext) {
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logInfo = getLogFn(controllerId, "info");
        var logSuccess = getLogFn(controllerId, 'success');
        var logError = getLogFn(controllerId, 'error');

        vm.addComment = addComment;
        vm.commentText = '';
        vm.cancel = cancel;
        vm.deleteComment = deleteComment;
        vm.getUsers = getUsers;
        vm.goBack = goBack;
        vm.hasChanges = false;
        vm.isSaving = false;
        vm.nextPage = nextPage;
        vm.paging = {
            busy:false,
            pageSize: 30,
            currentPage:0
        }
        vm.save = save;
        vm.selectedUser = '';
        vm.comments = [];
        vm.session = undefined;
        vm.sessionId = $stateParams.sessionId;
        vm.refresh = refresh;
        
       

        Object.defineProperty(vm, 'canSave', {
            get: canSave
        });
        
        activate();

        function activate() {
            common.toggleBusyMessage(true);
            onDestroy();
            onHasChanges();
            common.activateController([getSessionComments(),getCurrentSessionData()], controllerId).then(function () {
               
            });
        }
        
        function canSave() {
            return !vm.isSaving && vm.hasChanges;
        }
        
        function cancel() {
            datacontext.cancel();
            if (vm.session.entityAspect.entityState.isDetached()) {
                goBack();
            }
        }

        function deleteComment(comment) {
            comment.isActive = false;
        }

        function getCurrentSessionData() {
            return datacontext.session.getNameById(vm.sessionId).then(function(session) {
                vm.session = session;
            });
        }

        function nextPage() {
            if (vm.paging.busy) return;
            vm.paging.busy = true;
            getSessionComments();

        }
        
        function getSessionComments() {
            return datacontext.session.getComments(vm.paging.currentPage, vm.paging.pageSize, vm.sessionId).then(function (comments) {
                if (comments.length > 0) {
                    vm.comments = comments;
                    //vm.session = vm.comments[0].session;
                    vm.paging.currentPage++;
                    vm.paging.busy = false;
                }
            }, function (error) {
                common.toggleBusyMessage(false);
                logError('Unable to get session comments ' + error);
                goBack();
            });
        }
        
        function goBack() {
            $window.history.back();
        }
        
        function onDestroy() {
            $scope.$on('$destroy', function () {
                datacontext.cancel();
            });
        }
        
        function onHasChanges() {
            $scope.$on(config.events.hasChangesChanged, function (event, data) {
                vm.hasChanges = data.hasChanges;
            });
        }

        function getUsers(value) {
            return datacontext.user.getTypeaheadData(value).then(function (users) {
                return users.map(function (user) {
                    return user.firstName + " " + user.lastName;
                });
            });
        }

        function addComment() {
            var workingComment = datacontext.comment.create(vm.selectedUser,vm.commentText);
            vm.session.comments.push(workingComment);
            //workingComment.sessionId = vm.sessionId;
                return save().then(success, failed);

                function success() {
                    logSuccess("Comment added Succesfully");
                    refresh();
                }

                function failed(error) {
                    logError("Following errors ocurred:", error, true);
                    cancel();
                }
        }

        function refresh() {
            getSessionComments();
        }
        
         function save() {
             if (!canSave()) { return $q.when(null); } // Must return a promise
             vm.isSaving = true;
             common.toggleBusyMessage(true);
                 return datacontext.saveChanges()
                     .then(function (saveResult) {
                         vm.isSaving = false;
                         common.toggleBusyMessage(false);
                         vm.commentText = vm.selectedUser = '';
                     //goBack();
                 }, function (error) {
                         vm.isSaving = false;
                         common.toggleBusyMessage(false);
                         //goBack();
                     });             
         }
    }
})();
