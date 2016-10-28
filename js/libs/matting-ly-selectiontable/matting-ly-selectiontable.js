(function(angular) {

    angular.module('matting-ly.selectionTable', [
        'duScroll',                  // angular-scroll
        'matting-ly.selectionModel', // angular-selection-model
        'anguFixedHeaderTable',      // angu-fixed-header-table
        //"mattingly/selectionTable/template/selectionTable.html"
    ]).directive('selectionTable', [function() {

            var controller = function () {
                var vm = this;

                init();
                function init() {
                    vm.isFocused = false;

                    vm.data = [];
                    vm.columns = [];
                    vm.headers = [];
                    vm.reverse = true;
                    vm.orderby = null;

                    vm.selectedItems = [];

                    // Default to 'multiple' selection mode if we weren't passed one
                    if (!vm.selectionMode) {
                        vm.selectionMode = "'multiple'";
                    }

                    if (!vm.emptyDataString) {
                        vm.emptyDataString = "No Results Found";
                    }

                    if (!vm.menuOptions) {
                        vm.menuOptions = [];
                    }

                    if (!vm.onEnter) {
                        vm.onEnter = function() {};
                    }

                    if (!vm.onChange) {
                        vm.onChange = function() {};
                    }
                }

                vm.sort = function (key) {
                    vm.reverse = (vm.orderby === key) ? !vm.reverse : false;
                    vm.orderby = key;
                };

                vm.getRowCols = function (row) {
                    var orderedColumns = [];
                    vm.columns.forEach(function (column) {
                        orderedColumns.push(
                            {
                                'value': column.key.split('.').reduce(index, row), // See function index() below
                                'filter': column.filter,
                                'prepend': column.prepend,
                                'append': column.append
                            }
                        );

                    });
                    return orderedColumns;
                };
                // http://stackoverflow.com/questions/6393943/convert-javascript-string-in-dot-notation-into-an-object-reference
                function index(obj, i) {
                    return obj[i]
                }
            };

            var link = function (scope, elem, attrs, ngModelController) {

                // When the contents of ngModel change, assign the data to our
                // vm.data property for use in templates
                ngModelController.$render = function () {
                    scope.vm.data = ngModelController.$modelValue;
                    scope.vm.orderby = scope.vm.initialOrderBy;
                };

                var ths = elem.find('thead').find('tr').children();


                for (var i = 0; i < ths.length; i++) {
                    var th = ths[i];

                    scope.vm.columns.push({
                        key: th.hasAttribute('key') ? th.getAttribute('key') : null,
                        filter: th.hasAttribute('filter') ? th.getAttribute('filter') : null,
                        prepend: th.hasAttribute('prepend') ? th.getAttribute('prepend') : null,
                        append: th.hasAttribute('append') ? th.getAttribute('append') : null
                    });
                    scope.vm.headers.push({
                        key: th.hasAttribute('key') ? th.getAttribute('key') : null,
                        value: th.innerText
                    });
                }
            };

            return {
                restrict: 'E',
                scope: {
                    loading: '=',
                    dataHasLoaded: '=',
                    onEnter: '=?',
                    onChange: '=?',
                    maxTableHeight: '@',
                    selectionMode: '@',
                    emptyDataString: '=',
                    selectedItems: '=?',
                    initialOrderBy: '@'
                },
                require: 'ngModel',
                link: link,
                controller: controller,
                controllerAs: 'vm',
                bindToController: true,
                // TODO: Determine why $templateCache version of this doesn't load the selection-model properly
                templateUrl: '/assets/partials/directives/matting-ly-selectiontable.html',
                //templateUrl: 'mattingly/selectionTable/template/selectionTable.html',
                transclude: true
            };
    }]).directive('selectionTableColumn', [
        function () {
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
    }]).filter('meta', ['$filter',
        function ($filter) {
            return function(value, filterSpec) {
                var args = filterSpec.split(':');
                var filterName = args.shift() || "filter";
                if (filterName === 'undefined') {
                    filterName = "filter";
                }
                var filter = $filter(filterName);
                args.unshift(value);
                return filter.apply(null, args);
            };
    }]);

    // TemplateCache'd version of the selectionTable template
    // angular.module("mattingly/selectionTable/template/selectionTable.html", []).run(['$templateCache', function($templateCache) {
    //   $templateCache.put("mattingly/selectionTable/template/selectionTable.html",
    //     "<table ng-show=\"vm.data.length\"" +
    //         "fixed-header max-table-height=\"{{ vm.maxTableHeight }}\" table-render-events=\"{{ vm.tableRenderEvents }}\"" +
    //         "class=\"table table-bordered table-striped animated fadeIn\" tabindex=\"0\">" +
    //         "<thead>" +
    //             "<tr ng-transclude></tr>" +
    //         "</thead>" +
    //         "<tbody>" +
    //             "<tr ng-repeat=\"row in vm.data | orderBy:vm.orderby:vm.reverse\""+
    //                 "selection-model" +
    //                 "selection-model-type=\"'basic'\"" +
    //                 "selection-model-mode=\"{{ vm.selectionMode }}\""+
    //                 "selection-model-selected-items=\"vm.selectedItems\"" +
    //                 "selection-model-on-enter=\"vm.onEnter(row)\"" +
    //                 "selection-model-on-change=\"vm.onChange(row)\"" +
    //                 "context-menu=\"vm.menuOptions\">" +
    //                 "<td ng-repeat=\"col in columns = (columns || vm.getRowCols(row)) track by $index\">" +
    //                     "{{ col.prepend }}{{ col.value | meta:col.filter }}{{ col.append }}" +
    //                 "</td>" +
    //             "</tr>" +
    //         "</tbody>" +
    //     "</table>" +
    //     "");
    // }]);

})(window.angular);