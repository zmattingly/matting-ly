(function (angular) {
    angular.module('matting-ly')
        .controller('HeaderController', ['$scope',
            function ($scope) {
                $scope.stateNavs = [
                    {
                        'uisref': 'basic.home',
                        'text': 'Home'
                    },
                    {
                        'uisref': 'basic.about',
                        'text': 'About'
                    },
                    {
                        'uisref': 'basic.projects',
                        'text': 'Projects'
                    },
                ]
            }
    ]);
})(window.angular);