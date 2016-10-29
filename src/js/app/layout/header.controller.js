(function(angular) {

    HeaderController.$inject = ['$scope', 'AuthService'];
    function HeaderController ($scope, AuthService) {
        $scope.model = {
            stateNavs: [],
            isLoggedIn: false
        };

        $scope.init = function() {
            $scope.model.stateNavs = [
                {
                    'sref': 'public.home',
                    'text': 'Home'
                },
                {
                    'sref': 'public.about',
                    'text': 'About'
                },
                {
                    'sref': 'public.projects',
                    'text': 'Projects'
                }
            ];
            $scope.model.isLoggedIn = AuthService.returnFullLoginStatus();
        };
    }

    angular.module('matting-ly')
        .controller('HeaderController', HeaderController);

})(window.angular);