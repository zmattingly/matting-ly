(function(angular) {

    var AuthService = ['$q', '$timeout', '$http',
        function ($q, $timeout, $http) {

            var user = false;

            function returnFullLoginStatus() {
                getAccountStatus()
                    .then(function(){
                        return isLoggedIn();
                    });
            }

            function isLoggedIn() {
                return user;
            }

            function getAccountStatus() {
                return $http.get('/auth/account')
                    // handle success
                    .success(function (data) {
                        if (data._id) {
                            user = true;
                        } else {
                            user = false;
                        }
                    })
                    // handle error
                    .error(function (data) {
                        user = false;
                    });
            }

            function login(username, password) {
                var deferred = $q.defer();

                $http.post('/auth/login', {
                    username: username,
                    password: password
                }).success(function(data, status) {
                    if (status == 200 && data.status) {
                        user = true;
                        deferred.resolve();
                    } else {
                        user = false;
                        deferred.reject();
                    }
                }).error(function(data) {
                    user = false;
                    deferred.reject();
                });

                return deferred.promise;
            }

            function logout() {
                var deferred = $q.defer();

                $http.get('/auth/logout')
                    .success(function(data) {
                        user = false;
                        deferred.resolve();
                    }).error(function(data) {
                        user = false;
                        deferred.reject();
                    });

                return deferred.promise;
            }

            function register(username, password) {
                var deferred = $q.defer();

                $http.post('/auth/register', {
                    username: username,
                    password: password
                }).success(function(data, status) {
                    if (status == 200 && data.status) {
                        deferred.resolve();
                    } else {
                        deferred.reject();
                    }
                }).error(function(data) {
                    deferred.reject();
                });

                return deferred.promise;
            }

            // return available functions for use in the controllers
            return ({
                isLoggedIn: isLoggedIn,
                getAccountStatus: getAccountStatus,
                returnFullLoginStatus: returnFullLoginStatus,
                login: login,
                logout: logout,
                register: register
            });
    }];

    angular.module('matting-ly')
        .factory('AuthService', AuthService);

})(window.angular);