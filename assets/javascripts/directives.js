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

    angular.module('matting-ly')
        .directive('delayDisplayTilImageLoaded', delayDisplayTilImageLoaded)
        .directive('delayClassTilImageLoaded', delayClassTilImageLoaded)
    ;

})(window.angular);
