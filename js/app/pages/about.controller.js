(function(angular) {

    AboutController.$inject = ['$scope', '$http', '$timeout'];
    function AboutController($scope, $http, $timeout) {
        $scope.model = {
            header: '',
            byline: '',
            headlineImage: ''
        };

        $scope.init = function() {
            $scope.model.header = 'About';
            $scope.model.byline = 'A few things about me';
            $scope.model.headlineImage = '/assets/images/bgs/rings.jpg';
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

    angular.module('matting-ly')
        .controller('AboutController', AboutController);
})(window.angular);