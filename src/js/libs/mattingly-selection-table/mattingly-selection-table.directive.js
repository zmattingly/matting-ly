(function(angular) {

    selectionTable.$inject = [];
    function selectionTable() {

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

                // if (!vm.focusWhen) {
                //     vm.focusWhen = "'vm.data.length'";
                // }

                if (!vm.onChange) {
                    vm.onChange = function () {};
                }

                if (vm.onEnterKeypress && !vm.useKeyboardNavigation) {
                    throw 'onEnterKeypress must be used with useKeyboardNavigation';
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

            angular.element(elem[0].querySelectorAll('tbody')).css({
                'max-height': scope.vm.maxTableHeight ? scope.vm.maxTableHeight + 'px' : 'inherit',
            });

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

                tableClass: '@',
                maxTableHeight: '@',

                selectionMode: '@',
                initialOrderBy: '@',

                emptyDataString: '=?',
                selectedItems: '=?',
                useKeyboardNavigation: '=?',
                onEnterKeypress: '=?',
                onChange: '=?',
                focusWhen: '=?'
            },
            require: 'ngModel',
            link: link,
            controller: controller,
            controllerAs: 'vm',
            bindToController: true,
            templateUrl: 'mattingly/selectionTable/template/selectionTable.html',
            transclude: true
        };
    }

    angular.module('matting-ly.selectionTable')
        .directive('selectionTable', selectionTable);

    // TemplateCache'd version of the selectionTable template
    angular.module("mattingly/selectionTable/template/selectionTable.html", []).run(["$templateCache", function($templateCache) {
        $templateCache.put("mattingly/selectionTable/template/selectionTable.html", "" +
            "<table ng-show=\"vm.data.length\"\n" +
            "       fixed-header\n" +
            "       class=\"table table-bordered table-striped {{ vm.tableClass }}\" tabindex=\"0\" focus-when=\"{{ vm.data.length }}\">\n" +
            "    <thead>\n" +
            "        <tr ng-transclude></tr>\n" +
            "    </thead>\n" +
            "    <tbody>\n" +
            "        <tr ng-repeat=\"row in vm.data | orderBy:vm.orderby:vm.reverse\"\n" +
            "            selection-model\n" +
            "            selection-model-type=\"'basic'\"\n" +
            "            selection-model-mode=\"{{ vm.selectionMode }}\"\n" +
            "            selection-model-selected-items=\"vm.selectedItems\"\n" +
            "            selection-model-on-change=\"vm.onChange(row)\"\n" +
            "            selection-model-on-enter-keypress=\"vm.onEnterKeypress(row)\"\n" +
            "            selection-model-use-keyboard-navigation=\"vm.useKeyboardNavigation\"\n" +
            "        >\n" +
            "            <td ng-repeat=\"col in columns = (columns || vm.getRowCols(row)) track by $index\">\n" +
            "                {{ col.prepend }}{{ col.value | meta:col.filter }}{{ col.append }}\n" +
            "            </td>\n" +
            "        </tr>\n" +
            "    </tbody>\n" +
            "</table>\n" +
            "<div ng-hide=\"vm.data.length || vm.dataHasLoaded\">\n" +
            "    <div class=\"alert alert-info text-center\"><strong>{{ vm.emptyDataString }}</strong></div>\n" +
            "</div>\n" +
        "");
    }]);

}(window.angular));