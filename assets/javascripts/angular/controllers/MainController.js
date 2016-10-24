(function (angular) {
    angular.module('matting-ly')
        .controller('MainController', ['$scope', '$rootScope', '$state', '$filter', 'AlertService',
            function ($scope, $rootScope, $state, $filter, AlertService) {
                $scope.state = $state;

                // Root binding for AlertService
                $rootScope.closeAlert = AlertService.closeAlert;

                $scope.htmlToPlaintext = function($html) {
                    return $filter('htmlToPlaintext')($html);
                }
            }
    ]);
})(window.angular);