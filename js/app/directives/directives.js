(function (angular) {

    var delayDisplayTilImageLoaded = [function() {
        return {
            restrict: 'A',
            scope: false,
            link: function (scope, element, attrs) {
                element.addClass("ng-hide");
                var image = new Image();
                image.onload = function() {
                    scope.$apply(function () {
                        element.removeClass("ng-hide");
                    });
                };
                image.src = attrs.delayDisplayTilImageLoaded;
           }
       }
    }];

    var delayClassTilImageLoaded = [function() {
        return {
            restrict: 'A',
            scope: false,
            link: function (scope, element, attrs) {
                var image = new Image();
                image.onload = function() {
                    scope.$apply(function () {
                        element.addClass(attrs.delayedClasses);
                        // element.addClass('animated');
                        // element.addClass('fadeIn');
                    });
                };
                image.src = attrs.delayClassTilImageLoaded;
           }
       }
    }];

    var whenFocus = ['$timeout', function($timeout) {
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
    }];

    var backButton = ['$window', function($window) {
        return {
            restrict: 'A',
            scope: {},
            link: function(scope, element, attrs) {
                element.on('click', function() {
                    $window.history.back();
                });
            },
        };
    }];

    angular.module('matting-ly')
        .directive('delayDisplayTilImageLoaded', delayDisplayTilImageLoaded)
        .directive('delayClassTilImageLoaded', delayClassTilImageLoaded)
        .directive('whenFocus', whenFocus)
        .directive('backButton', backButton)
    ;

})(window.angular);
