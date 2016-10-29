(function(angular) {

    delayDisplayTilImageLoaded.$inject = [];
    function delayDisplayTilImageLoaded() {
        return {
            restrict: 'A',
            scope: false,
            link: function (scope, element, attrs) {
                element.addClass("ng-hide");
                var image = new Image();
                image.onload = function () {
                    scope.$apply(function () {
                        element.removeClass("ng-hide");
                    });
                };
                image.src = attrs.delayDisplayTilImageLoaded;
            }
        }
    }

    angular.module('matting-ly')
        .directive('delayDisplayTilImageLoaded', delayDisplayTilImageLoaded);

}(window.angular));