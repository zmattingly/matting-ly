(function(angular) {

    focusWhen.$inject = ['$timeout'];
    function focusWhen($timeout) {
        return {
            link: function (scope, element, attrs) {
                attrs.$observe('focusWhen', function(shouldFocus) {
                    if (shouldFocus) {
                        $timeout(function () {
                            element[0].focus();
                        })
                    }
                });
            }
        };
    }

   angular.module('matting-ly')
        .directive('focusWhen', focusWhen);

})(window.angular);