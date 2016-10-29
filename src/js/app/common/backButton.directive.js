(function(angular) {

    backButton.$inject = ['$window'];
    function backButton($window) {
        return {
            restrict: 'A',
            scope: {},
            link: function(scope, element, attrs) {
                element.on('click', function() {
                    $window.history.back();
                });
            },
        };
    }

   angular.module('matting-ly')
        .directive('backButton', backButton);

})(window.angular);