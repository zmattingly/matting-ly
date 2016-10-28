(function(angular) {

    HomeController.$inject = ['$scope', '$state', '$http', '$timeout'];
    function HomeController($scope, $state, $http, $timeout) {
        $scope.model = {
            header: '',
            byline: '',
            headlineImage: '',
            posts: []
        };

        $scope.init = function() {
            $scope.model.header = 'Zane Mattingly';
            $scope.model.byline = 'Full-stack Developer';
            $scope.model.headlineImage = '/assets/images/bgs/robot.jpg';
            $scope.getPosts();
        };

        $scope.getPosts = function() {
            $http.get('/api/posts')
                .success(function(data) {
                    $timeout(function() {
                        $scope.model.posts = data;
                    }, 500);
                })
                .error(function(data, status, error, config) {
                    $state.go('error.oops');
                });
        };
    }

    angular.module('matting-ly')
        .controller('HomeController', HomeController);

})(window.angular);