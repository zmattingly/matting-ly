(function(angular) {

    delayClassTilImageLoaded.$inject = [];
    function delayClassTilImageLoaded() {
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
    }

   angular.module('matting-ly')
        .directive('delayClassTilImageLoaded', delayClassTilImageLoaded);

})(window.angular);