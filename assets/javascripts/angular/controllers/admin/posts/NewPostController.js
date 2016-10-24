(function () {
    angular.module('matting-ly')
        .controller('NewPostController', ['$scope', '$state', '$http',
            function ($scope, $state, $http) {
                $scope.model = {
                    header: 'Brand-Spankin New Post',
                    post: {
                        heading: undefined,
                        date: Date.now(),
                        content: undefined,
                        author: undefined,
                        published: false
                    },
                    dateOptions: {
                        maxDate: new Date(2020, 5, 22),
                        minDate: new Date(),
                        startingDay: 1
                    },
                    dateFormats: [
                        'longDate', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy'
                    ],
                    defaultFormat: 'longDate'
                };

                $scope.init = function() {};

                $scope.datePickerOpen = function() {
                    $scope.model.datePickerOpen = true;
                };

                $scope.submitPost = function(post) {
                    $http.post('/api/posts', post)
                        .success(function(data) {
                            if (data._id) {
                                $state.go('admin.editPost', {postId: data._id})
                            } else {
                                console.error(data);
                                $state.go('error.500');
                            }
                        })
                        .error(function(data) {
                            console.error(data);
                            $state.go('error.500');
                        });
                }
            }
    ]);
})();