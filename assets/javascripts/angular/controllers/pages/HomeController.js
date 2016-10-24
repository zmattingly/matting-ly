(function () {
    angular.module('matting-ly')
        .controller('HomeController', ['$scope', '$state', '$http', '$timeout',
            function ($scope, $state, $http, $timeout) {
                $scope.model = {
                    header: 'Zane Mattingly',
                    byline: 'Full-stack Developer',
                    headlineImage: '/assets/images/bgs/robot.jpg',
                    posts: []
                };

                $scope.init = function() {
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
                }
            }
    ]);
})();