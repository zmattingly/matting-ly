(function(angular) {

    function selectionTableColumn() {
        var link = function (scope, elem, attrs, selectorTableController, transclude) {

            transclude(scope, function (content) {
                // Create TH with the same attributes as the <header> elements
                var thString;

                // TODO: Could this be handled better using $interpolate?
                thString = '<th';
                thString += ' key="' + scope.key + '"';
                thString += ' filter="' + scope.filter + '"'
                if (scope.append) {
                    thString += ' append="' + scope.append + '"';
                }
                if (scope.prepend) {
                    thString += ' prepend="' + scope.prepend + '"';
                }
                thString += '>';
                thString += content.html();
                thString += '</th>';

                var th = angular.element(thString);

                // On header click, call to parent controller's sort function with our key
                th.on('click', function () {
                    scope.$apply(function () {
                        selectorTableController.sort(scope.key);
                        th.addClass('sorted '+scope.reverse)
                    });
                });

                elem.replaceWith(th);
            });
        };

        return {
            restrict: 'E',
            transclude: true,
            require: '^selectionTable',
            scope: {
                key: '@',
                filter: '@',
                append: '@',
                prepend: '@'
            },
            link: link
        }
    }

    angular.module('matting-ly.selectionTable')
        .directive('selectionTableColumn', selectionTableColumn);

})(window.angular);