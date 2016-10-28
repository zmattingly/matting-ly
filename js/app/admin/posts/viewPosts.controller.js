(function(angular) {

    ViewPostsController.$inject = ['$scope', '$state', '$http'];
    function ViewPostsController($scope, $state, $http) {
        $scope.model = {
            header: 'View/Edit Posts',
            allPosts: [],
            selectedPost: []
        };

        $scope.init = function() {
            // Give us a half-sec to check out the nifty spinner
            setTimeout(function() {
                $scope.getPosts();
            }, 500)
        };

        $scope.selectAndGoToPost = function() {
            var selectedPost = $scope.model.selectedPost[0];
            // Navigate to the specific post to edit
            $state.go('admin.editPost', {postId: selectedPost._id});
        };

        // Main View
        $scope.getPosts = function() {
            $http.get('/api/posts/all')
                .success(function(data) {
                    $scope.model.allPosts = data;
                    // Auto-select first element
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