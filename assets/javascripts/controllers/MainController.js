(function (angular) {
    angular.module('matting-ly')
        .controller('MainController', ['$scope', '$rootScope', '$state', 'AlertService',
            function ($scope, $rootScope, $state, AlertService) {
                $scope.state = $state;

                // Root binding for AlertService
                $rootScope.closeAlert = AlertService.closeAlert;
            }
    ]);
})(window.angular);