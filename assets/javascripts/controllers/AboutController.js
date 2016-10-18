(function () {
    angular.module('matting-ly')
        .controller('AboutController', ['$scope',
            function ($scope) {
                $scope.model = {
                    header: 'About',
                    byline: 'A few things about me'
                };
            }
    ]);
})();