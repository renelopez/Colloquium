(function () {
    'use strict';

    var controllerId = 'commentsCtrl';

    angular.module('app').controller(controllerId,
        ['$q','$scope', '$stateParams', '$window','lodash', 'common', 'config', 'datacontext', colloquiumSessionDetailCtrl]);

    function colloquiumSessionDetailCtrl($q,$scope, $stateParams, $window,lodash, common, config, datacontext) {
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var logInfo = getLogFn(controllerId, "info");
        var logSuccess = getLogFn(controllerId, 'success');
        var logError = getLogFn(controllerId, 'error');

        var canScroll = true,canIncrement=true;

        vm.addComment = addComment;
        vm.autocompleteOptions = ({
            minLength: 1,
            dataSource: new kendo.data.DataSource({
                transport: {
                    read: function (options) {
                        return vm.getUsers(options, vm.selectedUser);
                    }
                }
            })
        });
        vm.commentText = '';
        vm.cancel = cancel;
        vm.deleteComment = deleteComment;
        vm.getUsers = getUsers;
        vm.goBack = goBack;
        vm.hasChanges = false;
        vm.isSaving = false;
        vm.loadMoreData = loadMoreData;
        vm.nextPage = nextPage;
        vm.paging = {
            busy:false,
            pageSize: 25,
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
            common.activateController([getFullSessionComments(),getCurrentSessionData()], controllerId).then(function () {
               
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
            canScroll = false;
            lodash.remove(vm.comments, function(currentArrayComment) {
                return currentArrayComment.commentId === comment.commentId;
            });
            save().then(success, failed);

            function success() {
                logSuccess("The following comment was deleted:" + comment.commentId + ".");
                //refresh();
            }

            function failed(error) {
                logError("Following errors ocurred:", error, true);
                cancel();
            }
        }

        function getCurrentSessionData(forceRefresh) {
            return datacontext.session.getNameById(vm.sessionId,forceRefresh).then(function(session) {
                vm.session = session;
            });
        }

        function nextPage() {
            if (vm.paging.busy || !canScroll) return;
            vm.paging.currentPage++;
            vm.paging.busy = true;
            getSessionComments();
        }
        
        function getSessionComments() {
            return datacontext.session.getComments(vm.paging.currentPage, vm.paging.pageSize, vm.sessionId).then(function (comments) {
                if (comments.length > 0) {
                    vm.comments = lodash.union(vm.comments, comments);
                } else {
                    canScroll = false;
                }
                vm.paging.busy = false;
            }, function (error) {
                vm.paging.busy = false;
                canScroll = false;
                common.toggleBusyMessage(false);
                logError('Unable to get session comments ' + error);
                goBack();
            });
        }

        function getFullSessionComments() {
            return datacontext.session.getComments(vm.paging.currentPage, vm.paging.pageSize, vm.sessionId).then(function (comments) {
                vm.comments = comments;
                if (vm.comments.length < 0) {
                    canScroll = false;
                }
                vm.paging.busy = false;
            }, function (error) {
                vm.paging.busy = false;
                canScroll = false;
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

        function getUsers(options, value) {
            return datacontext.user.getTypeaheadData(value).then(function (users) {
                var usersRetrieved = users.map(function (user) {
                    return user.firstName + " " + user.lastName;
                });
                options.success(usersRetrieved);
            });
        }

        function addComment() {
            canScroll = false;
            var workingComment = datacontext.comment.create(vm.selectedUser, vm.commentText, vm.session.id);
            vm.comments.push(workingComment);
                return save().then(success, failed);

                function success() {
                    logSuccess("Comment added Succesfully");
                    refresh();
                }

                function failed(error) {
                    logError("Following err" +
                        "ors ocurred:", error, true);
                    cancel();
                }
        }

        function refresh() {
            canScroll = true;
            vm.paging.busy = false;

            vm.paging.currentPage = 0;
            getFullSessionComments();
        }

        function loadMoreData() {
            canScroll = true;
            vm.paging.busy = false;

            vm.paging.currentPage = Math.floor(vm.comments.length / vm.paging.pageSize) + 1;
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
