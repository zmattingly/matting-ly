(function () {
    angular.module('matting-ly')
        .controller('ProjectsController', ['$scope', '$http', '$state', '$timeout',
            function ($scope, $http, $state, $timeout) {
                $scope.model = {
                    header: 'Projects',
                    byline: "A few things I've worked on...",
                    headlineImage: '/assets/images/bgs/yellow_flower_sky.jpg',
                    projects: []
                };

                $scope.init = function() {
                    $scope.getProjects();
                };

                $scope.getProjects = function() {
                    $http.get('/api/projects')
                        .success(function(data) {
                            $timeout(function() {
                                $scope.model.projects = data;
                            }, 500);
                        })
                        .error(function(data, status, error, config) {
                            $state.go('error.oops');
                        });
                }
            }
    ]);
})();