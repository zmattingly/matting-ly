(function (angular) {
    angular.module('matting-ly')
        .controller('HeaderController', ['$scope', '$state', 'AuthService',
            function ($scope, $state, AuthService) {
                $scope.$state = $state;
                $scope.model = {
                    stateNavs: [
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
                    ],
                    adminButton: {
                        adminButton: {
                            'sref': 'auth.login'
                        }
                    },
                    isLoggedIn: function() {}
                };

                $scope.init = function() {
                    $scope.model.isLoggedIn = AuthService.returnFullLoginInStatus();
                }
            }
    ]);
})(window.angular);