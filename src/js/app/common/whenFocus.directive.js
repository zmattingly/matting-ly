(function(angular) {

    whenFocus.$inject = ['$timeout'];
    function whenFocus($timeout) {
        return {
            scope: {
                whenFocus: '='
            },
            link: function (scope, element, attrs) {
                scope.$watch('whenFocus', function (shouldFocus) {
                    if (shouldFocus) {
                        $timeout(function () {
                            element[0].focus();
                        })
                    }
                })
            },
        };
    }

   angular.module('matting-ly')
        .directive('whenFocus', whenFocus);

})(window.angular);