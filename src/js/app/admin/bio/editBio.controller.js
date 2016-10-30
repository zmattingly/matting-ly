(function(angular) {

    EditBioController.$inject = ['$scope', '$state', '$http'];
    function EditBioController ($scope, $state, $http) {
        $scope.model = {
            header: 'Edit Bio',
            bio: {},
            bioLoading: true
        };
        // TinyMCE Editor Setup
        $scope.editingContent = false;
        $scope.defaultTinymceOptions.setup = function(ed) {
            ed.on('blur', function(e) {
                $scope.editingContent = false;
                $scope.$apply();
            });
        };
        $scope.$watch('editingContent', function(newVal, oldVal) {
            if (newVal == true && oldVal == false) {
                $timeout(function() {
                    tinyMCE.activeEditor.focus();
                }, 50);
            }
        });

        $scope.init = function() {
            // Give us a half-sec to check out the nifty spinner
            setTimeout(function() {
                $scope.getBio();
            }, 500)
        };

        $scope.getBio = function() {
            $scope.model.bioLoading = true;
            $http.get('/api/bio')
                .success(function(data) {
                    $scope.model.bio = data;
                    $scope.model.bioLoading = false;
                })
                .error(function(data) {
                    console.error(data);
                    $state.go('error.500');
                });
        };

        $scope.submitEdits = function(bio) {
            $http.put('/api/bio', bio)
                .success(function(data) {
                    $scope.getBio();
                })
                .error(function(data) {
                    console.error(data);
                    $state.go('error.500');
                });
        };
    }

    angular.module('matting-ly')
        .controller('EditBioController', EditBioController);

})(window.angular);