(function(angular) {

    ViewPostsController.$inject = ['$scope', '$state', '$http'];
    function ViewPostsController($scope, $state, $http) {
        $scope.model = {
            header: 'View/Edit Posts',
            allPosts: [],
            selectedPost: [],
            postsHaveLoaded: false,
            postsEmptyDataString: 'No Posts Found!'
        };

        $scope.init = function() {
            // Give us a half-sec to check out the nifty spinner
            setTimeout(function() {
                $scope.getPosts();
            }, 500)
        };

        $scope.selectAndGoToPost = function() {
            // Navigate to the specific post to edit
            $state.go('admin.editPost', {postId: $scope.model.selectedPost[0]._id});
        };

        // Main View
        $scope.getPosts = function() {
            $http.get('/api/posts/all')
                .success(function(data) {
                    $scope.model.postsHaveLoaded = true;
                    $scope.model.allPosts = data;
                    // Auto-select first element
                    $scope.model.allPosts = $scope.model.allPosts.sort(function(a, b) {
                        if (a.date > b.date) {
                            return -1;
                        } else if (a.date < b.date) {
                            return 1;
                        } else {
                            return 0;
                        }
                    });
                    $scope.model.allPosts[0].selected = true;
                })
                .error(function(data) {
                    // TODO: Better error handling here
                    console.error(data);
                    $state.go('error.500');
                });
        };
    }

    angular.module('matting-ly')
        .controller('ViewPostsController', ViewPostsController);

})(window.angular);