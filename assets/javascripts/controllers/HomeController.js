(function () {
    angular.module('matting-ly')
        .controller('HomeController', ['$scope', '$http',
            function ($scope, $http) {
                $scope.model = {
                    header: 'Zane Mattingly',
                    byline: 'Full-stack Developer'
                };
                $scope.headlineImage = '/assets/images/bgs/robot.jpg';
                $scope.posts = [];

                $scope.init = function() {
                    $scope.getBlogPosts();
                };

                $scope.getBlogPosts = function(startVal) {
                    $http.get('/api/posts.json?start='+startVal)
                        .success(function(data) {
                            $scope.posts = data;
                        })
                        .error(function(data, status, error, config) {
                            $scope.posts = [
                                { heading: "Error", content: "Could not load json data"}
                            ];
                        });
                }
            }
    ]);
})();