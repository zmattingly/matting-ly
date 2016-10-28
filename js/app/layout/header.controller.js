(function (angular) {

    HeaderController.$inject = ['$scope', 'AuthService'];
    function HeaderController ($scope, AuthService) {
        $scope.model = {
            stateNavs: [],
            isLoggedIn: false
        };

        $scope.init = function() {
            $scope.model.stateNavs = [
                {
                    'sref': 'pages.home',
                    'text': 'Home'
                },
                {
                    'sref': 'pages.about',
                    'text': 'About'
                },
                {
                    'sref': 'pages.projects',
                    'text': 'Projects'
                }
            ];
            $scope.model.isLoggedIn = AuthService.returnFullLoginStatus();
        };
    }

    angular.module('matting-ly')
        .controller('HeaderController', HeaderController);

})(window.angular);