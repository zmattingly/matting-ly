(function() {
    var LoginController = ['$scope', '$state', 'AuthService',
        function ($scope, $state, AuthService) {
            $scope.model = {
                error: '',
                disabled: false,
                loginForm: {
                    username: '',
                    password: ''
                },
                isLoggedIn: false
            };

            $scope.init = function() {
                if (AuthService.isLoggedIn()) {
                   $state.go('admin.viewPosts');
                } else {
                    AuthService.getAccountStatus()
                        .then(function(){
                            if (AuthService.isLoggedIn()) {
                                $state.go('admin.viewPosts');
                            }
                        });
                }
            };

            $scope.dropdownInit = function() {
                AuthService.getAccountStatus()
                    .then(function(){
                        $scope.model.isLoggedIn = AuthService.isLoggedIn();
                    });
            };

            $scope.login = function () {
                $scope.model.error = '';
                $scope.model.disabled = true;

                // call login from service
                AuthService.login($scope.model.loginForm.username, $scope.model.loginForm.password)
                    // handle success
                    .then(function () {
                        $state.go('admin.viewPosts');
                    })
                    // handle error
                    .catch(function () {
                        $scope.model.error = "Invalid username and/or password";
                        $scope.model.disabled = false;
                        $scope.model.loginForm = {};
                    });

            };

            $scope.logout = function() {
                AuthService.logout()
                    // handle success
                    .then(function() {
                        $state.go('pages.home', {}, { reload: true });
                    })
                    // handle error
                    .catch(function() {
                        $state.go('error.oops');
                    })
            };
        }
    ];

    angular.module('matting-ly')
        .controller('LoginController', LoginController);

})(window.angular);