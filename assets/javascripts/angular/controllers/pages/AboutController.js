(function () {
    angular.module('matting-ly')
        .controller('AboutController', ['$scope', '$http', '$timeout',
            function ($scope, $http, $timeout) {
                $scope.model = {
                    header: 'About',
                    byline: 'A few things about me',
                    headlineImage: '/assets/images/bgs/rings.jpg'
                };

                $scope.init = function() {
                    $scope.getBio();
                };

                $scope.getBio = function() {
                    $http.get('/api/bio')
                        .success(function(data) {
                            $timeout(function() {
                                $scope.model.bio = data;
                            }, 500);
                        })
                        .error(function(data, status, error, config) {
                            $state.go('error.oops');
                        });
                }
            }
    ]);
})();