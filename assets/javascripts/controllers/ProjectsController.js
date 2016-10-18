(function () {
    angular.module('matting-ly')
        .controller('ProjectsController', ['$scope', '$http',
            function ($scope, $http) {
                $scope.model = {
                    header: 'Projects',
                    byline: 'A few things I\'ve worked on...'
                };
                $scope.headlineImage = '/assets/images/bgs/yellow_flower_sky.jpg';
                $scope.projects = [];

                $scope.init = function() {
                    $scope.getProjects();
                };

                $scope.getProjects = function(startVal) {
                    $http.get('/api/projects.json?start='+startVal)
                        .success(function(data) {
                            $scope.projects = data;
                            console.log(data);
                        })
                        .error(function(data, status, error, config) {
                            $scope.projects = [
                                { heading: "Error", text: "Could not load json data" }
                            ];
                        });
                }
            }
    ]);
})();