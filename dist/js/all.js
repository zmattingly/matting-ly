(function (angular) {
    var app = angular.module('matting-ly', [
        'matting-ly.routing',        // matting-ly Angular UI Router and config
        'matting-ly.selectionTable', // matting-ly selectionTable
        'ngResource',                // $sce
        'ui.bootstrap',              // Angular UI Bootstrap
        'ui.bootstrap.tpls',         // Angular UI Bootstrap Default Templates
        'ui.tinymce'                 // Angular UI
    ]);

    run.$inject = ['$rootScope', '$state', 'AuthService'];
    function run($rootScope, $state, AuthService) {
        $rootScope.$state = $state;

        $rootScope.$on('$stateChangeStart',
            function (event, toState, toParams, fromState, fromParams, options) {

                AuthService.getAccountStatus()
                    .then(function(){
                        if (toState.access.restricted && !AuthService.isLoggedIn()) {
                            event.preventDefault();
                            $state.go('pages.home');
                        }
                    });
            }
        );
    }

    app.run(run)
        ;
})(window.angular);
(function(angular) {

    ViewPostsController.$inject = ['$scope', '$state', '$http'];
    function ViewPostsController($scope, $state, $http) {
        $scope.model = {
            header: 'View/Edit Posts',
            allPosts: [],
            selectedPost: [],
            postsHaveLoaded: false,
            postsEmptyDataString: 'No Posts Found!'
        };

        $scope.init = function() {
            // Give us a half-sec to check out the nifty spinner
            setTimeout(function() {
                $scope.getPosts();
            }, 500)
        };

        $scope.selectAndGoToPost = function() {
            // Navigate to the specific post to edit
            $state.go('admin.editPost', {postId: $scope.model.selectedPost[0]._id});
        };

        // Main View
        $scope.getPosts = function() {
            $http.get('/api/posts/all')
                .success(function(data) {
                    $scope.model.postsHaveLoaded = true;
                    $scope.model.allPosts = data;
                    // Auto-select first element
                    $scope.model.allPosts[0].selected = true;
                })
                .error(function(data) {
                    // TODO: Better error handling here
                    console.error(data);
                    $state.go('error.500');
                });
        };
    }

    angular.module('matting-ly')
        .controller('ViewPostsController', ViewPostsController);

})(window.angular);
(function(angular) {

    NewPostController.$inject = ['$scope', '$state', '$http'];
    function NewPostController($scope, $state, $http) {
        $scope.model = {
            header: 'Brand-Spankin New Post',
            post: {
                heading: undefined,
                date: Date.now(),
                content: undefined,
                author: undefined,
                published: false
            },
            dateOptions: {
                maxDate: new Date(2020, 5, 22),
                minDate: new Date(),
                startingDay: 1
            },
            dateFormats: [
                'longDate', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy'
            ],
            defaultDateFormat: 'longDate',
        };

        $scope.init = function() {};

        $scope.datePickerOpen = function() {
            $scope.model.datePickerOpen = true;
        };

        $scope.submitPost = function(post) {
            $http.post('/api/posts', post)
                .success(function(data) {
                    if (data._id) {
                        $state.go('admin.editPost', {postId: data._id})
                    } else {
                        console.error(data);
                        $state.go('error.500');
                    }
                })
                .error(function(data) {
                    console.error(data);
                    $state.go('error.500');
                });
        }
    }

    angular.module('matting-ly')
        .controller('NewPostController', NewPostController);

})(window.angular);
(function(angular) {

    EditPostsController.$inject = ['$scope', '$state', '$http'];
    function EditPostsController ($scope, $state, $http) {
        $scope.model = {
            header: 'Edit Post',
            post: {},
            postLoading: true,
            datePickerOpen: false,
            dateOptions: {
                maxDate: new Date(2020, 5, 22),
                minDate: new Date(),
                startingDay: 1
            },
            dateFormats: [
                'longDate', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy'
            ],
            defaultDateFormat: 'longDate',
        };

        $scope.init = function() {
            // Give us a half-sec to check out the nifty spinner
            setTimeout(function() {
                $scope.getPost();
            }, 500)
        };

        $scope.datePickerOpen = function() {
            $scope.model.datePickerOpen = true;
        };

        $scope.getPost = function() {
            $scope.model.postLoading = true;
            $http.get('/api/posts/' + $state.params.postId)
                .success(function(data) {
                    if (!data._id) {
                        console.error("Error retrieving post " + $state.params.postId);
                        $state.go('error.404');
                    }
                    $scope.model.post = data;
                    $scope.model.post.date = new Date($scope.model.post.date);
                    $scope.model.postLoading = false;
                })
                .error(function(data) {
                    console.error(data);
                    $state.go('error.500');
                });
        };

        $scope.submitEdits = function(post) {
            $http.put('/api/posts/' + post._id, post)
                .success(function(data) {
                    $scope.getPost();
                })
                .error(function(data) {
                    console.error(data);
                    $state.go('error.500');
                });
        };

        $scope.deletePost = function(post) {
            $http.delete('/api/posts/' + post._id)
                .success(function(data) {
                    $state.go('admin.viewPosts')
                })
                .error(function(data) {
                    console.error(data);
                    $state.go('error.500');
                });
        };
    }

    angular.module('matting-ly')
        .controller('EditPostController', EditPostsController);

})(window.angular);
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
angular.module("ui.tinymce",[]).value("uiTinymceConfig",{}).directive("uiTinymce",["$rootScope","$compile","$timeout","$window","$sce","uiTinymceConfig",function(a,b,c,d,e,f){f=f||{};var g="ui-tinymce";return f.baseUrl&&(tinymce.baseURL=f.baseUrl),{require:["ngModel","^?form"],priority:599,link:function(h,i,j,k){function l(a){a?(m(),o&&o.getBody().setAttribute("contenteditable",!1)):(m(),o&&!o.settings.readonly&&o.getDoc()&&o.getBody().setAttribute("contenteditable",!0))}function m(){o||(o=tinymce.get(j.id))}if(d.tinymce){var n,o,p=k[0],q=k[1]||null,r={debounce:!0},s=function(b){var c=b.getContent({format:r.format}).trim();c=e.trustAsHtml(c),p.$setViewValue(c),a.$$phase||h.$digest()};j.$set("id",g+"-"+(new Date).valueOf()),n={},angular.extend(n,h.$eval(j.uiTinymce));var t=function(a){var b;return function(d){c.cancel(b),b=c(function(){return function(a){a.isDirty()&&(a.save(),s(a))}(d)},a)}}(400),u={setup:function(b){b.on("init",function(){p.$render(),p.$setPristine(),p.$setUntouched(),q&&q.$setPristine()}),b.on("ExecCommand change NodeChange ObjectResized",function(){return r.debounce?void t(b):(b.save(),void s(b))}),b.on("blur",function(){i[0].blur(),p.$setTouched(),a.$$phase||h.$digest()}),b.on("remove",function(){i.remove()}),f.setup&&f.setup(b,{updateView:s}),n.setup&&n.setup(b,{updateView:s})},format:n.format||"html",selector:"#"+j.id};angular.extend(r,f,n,u),c(function(){r.baseURL&&(tinymce.baseURL=r.baseURL);var a=tinymce.init(r);a&&"function"==typeof a.then?a.then(function(){l(h.$eval(j.ngDisabled))}):l(h.$eval(j.ngDisabled))}),p.$formatters.unshift(function(a){return a?e.trustAsHtml(a):""}),p.$parsers.unshift(function(a){return a?e.getTrustedHtml(a):""}),p.$render=function(){m();var a=p.$viewValue?e.getTrustedHtml(p.$viewValue):"";o&&o.getDoc()&&(o.setContent(a),o.fire("change"))},j.$observe("disabled",l),h.$on("$tinymce:refresh",function(a,c){var d=j.id;if(angular.isUndefined(c)||c===d){var e=i.parent(),f=i.clone();f.removeAttr("id"),f.removeAttr("style"),f.removeAttr("aria-hidden"),tinymce.execCommand("mceRemoveEditor",!1,d),e.append(b(f)(h))}}),h.$on("$destroy",function(){m(),o&&(o.remove(),o=null)})}}}}]);
angular.module("selectionModel",[]),angular.module("selectionModel").directive("selectionModelIgnore",[function(){"use strict";return{restrict:"A",link:function(a,b,c){var d=function(a){a.selectionModelIgnore=!0,a.originalEvent&&(a.originalEvent.selectionModelIgnore=!0)};b.on("click",function(b){(!c.selectionModelIgnore||a.$eval(c.selectionModelIgnore))&&d(b)})}}}]),angular.module("selectionModel").directive("selectionModel",["selectionStack","uuidGen","selectionModelOptions",function(a,b,c){"use strict";return{restrict:"A",link:function(d,e,f){var g=c.get(),h=g.selectedAttribute,i=g.selectedClass,j=g.type,k=g.mode,l=g.cleanupStrategy,m=d.$eval(f.selectionModelType)||j,n=d.$eval(f.selectionModelMode)||k,o=/^multi(ple)?(-additive)?$/.test(n),p=/^multi(ple)?-additive/.test(n),q=d.$eval(f.selectionModelSelectedAttribute)||h,r=d.$eval(f.selectionModelSelectedClass)||i,s=d.$eval(f.selectionModelCleanupStrategy)||l,t=f.selectionModelOnChange,u=f.ngRepeat;if(!u)throw"selectionModel must be used along side ngRepeat";var v=d.$eval(f.selectionModelSelectedItems),w=function(){if(!o)return null;var a="data-selection-model-stack-id",c=e.attr(a);return c?c:(c=e.parent().attr(a))?(e.attr(a,c),c):(c=b.create(),e.attr(a,c),e.parent().attr(a,c),c)}(),x=u.split(/\sin\s|\strack\sby\s/g),y=d.$eval(x[0]),z=x.length>2,A=function(){if(y[q]?e.addClass(r):e.removeClass(r),"checkbox"===m){var a=[];angular.forEach(e.find("input"),function(b){b=angular.element(b),"checkbox"===b.attr("type")&&a.push(b)}),a.length&&a[0].prop("checked",y[q])}},B=function(){return d.$eval(x[1])},C=function(){return d.$eval(x[1].split(/[|=]/)[0])},D=function(a){var b,c=angular.isArray(v),d=angular.isArray(a)&&2===a.length,e=C(),f=0,g=!1;c&&(v.length=0),angular.forEach(e,function(e){d?(b=a.indexOf(e),b>-1?(f++,g=!1,a.splice(b,1)):g=1!==f):g=e!==a,g?e[q]=!1:c&&e[q]&&v.push(e)})},E=function(a){var b=(B(),!1),c=!1;a=a||y,angular.forEach(B(),function(d){c=c||d===y,b=b||d===a;var e=b+c===1;(e||d===y||d===a)&&(d[q]=!0)})},F=function(b){if(!(b.selectionModelIgnore||b.originalEvent&&b.originalEvent.selectionModelIgnore||b.selectionModelClickHandled||b.originalEvent&&b.originalEvent.selectionModelClickHandled)){b.selectionModelClickHandled=!0,b.originalEvent&&(b.originalEvent.selectionModelClickHandled=!0);var c=b.ctrlKey||b.metaKey||p,f=b.shiftKey,g=b.target||b.srcElement,h="checkbox"===m&&"INPUT"===g.tagName&&"checkbox"===g.type;if("LABEL"===g.tagName){var i=angular.element(g).attr("for");if(i){var j,k=e[0].getElementsByTagName("INPUT");for(j=k.length;j--;)if(k[j].id===i)return}else if(g.getElementsByTagName("INPUT").length)return}if(f&&o&&!h)return c||d.$apply(function(){D([y,a.peek(w)])}),E(a.peek(w)),void d.$apply();if(c||f||h){var l=!y[q];return o||D(y),y[q]=l,y[q]&&a.push(w,y),void d.$apply()}D(y),d.$apply(),y[q]=!0,a.push(w,y),d.$apply()}},G=function(){if(angular.isArray(v)){var a=v.indexOf(y);y[q]?-1===a&&v.push(y):a>-1&&v.splice(a,1)}};if(e.on("click",F),"checkbox"===m){var H=e.find("input");H[0]&&"checkbox"===H[0].type&&e.find("input").on("click",F)}A(),G(),"deselect"===s&&d.$on("$destroy",function(){var a=y[q];y[q]=!1,G(),t&&a&&d.$eval(t)}),d.$watch(x[0]+"."+q,function(a,b){a!==b&&(o||!a||b||(D(y),y[q]=!0),A(),G(),t&&d.$eval(t))}),z&&d.$watch(x[0],function(a){y=a})}}}]),angular.module("selectionModel").provider("selectionModelOptions",[function(){"use strict";var a={selectedAttribute:"selected",selectedClass:"selected",type:"basic",mode:"single",cleanupStrategy:"none"};this.set=function(b){angular.extend(a,b)},this.$get=function(){var b={get:function(){return angular.copy(a)}};return b}}]),angular.module("selectionModel").service("selectionStack",function(){"use strict";var a={},b=1e3,c={};return a.push=function(a,d){c.hasOwnProperty(a)||(c[a]=[]);var e=c[a];for(e.push(d);e.length>b;)e.shift();return e.length},a.pop=function(a){c.hasOwnProperty(a)||(c[a]=[]);var b=c[a];return b.pop()},a.peek=function(a){c.hasOwnProperty(a)||(c[a]=[]);var b=c[a];return b.length?b[b.length-1]:void 0},a}),angular.module("selectionModel").service("uuidGen",function(){"use strict";var a={},b=["0","0","0"];return a.create=function(){for(var a,c=b.length;c;){if(c--,a=b[c].charCodeAt(0),57===a)return b[c]="A",b.join("");if(90!==a)return b[c]=String.fromCharCode(a+1),b.join("");b[c]="0"}return b.unshift("0"),b.join("")},a});

/**
 * The Selection Model module
 *
 * The ngRepeat companion. This module exists to give developers a lightweight
 * option for easily managing selections in lists and tables. It also aims to
 * play nicely with native angular features so you can leverage existing tools
 * for filtering, sorting, animations, etc.
 *
 * Modified to include up/down arrow navigation by Zane Mattingly
 *
 * @package selectionModel
 */

angular.module('matting-ly.selectionModel', ['duScroll']);


/**
 * Selection Model Ignore
 *
 * For clickable elements that don't directly interact with `selectionModel`.
 *
 * Useful for when you want to manually change the selection, or for things like
 * "delete" buttons that belong under `ngRepeat` but shouldn't select an item
 * when clicked.
 *
 * @package selectionModel
 * @copyright 2014 Justin Russell, released under the MIT license
 */

angular.module('matting-ly.selectionModel').directive('selectionModelIgnore', [
  function() {
    'use strict';
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var ignore = function(event) {
          event.selectionModelIgnore = true;

          /**
           * If jQuery is on the page `event` will actually be a jQuery Event
           * and other handlers will only get to see a subset of the event
           * properties that supported by all browsers. Our custom attribute
           * will be dropped. We need to instead decorate the original event
           * object.
           *
           * @see https://github.com/jtrussell/angular-selection-model/issues/27
           */
          if(event.originalEvent) {
            event.originalEvent.selectionModelIgnore = true;
          }
        };

        element.on('click', function(event) {
          if(!attrs.selectionModelIgnore || scope.$eval(attrs.selectionModelIgnore)) {
            ignore(event);
          }
        });
      }
    };
  }
]);


/**
 * Selection Model - a selection aware companion for ngRepeat
 *
 * @package selectionModel
 * @copyright 2014 Justin Russell, released under the MIT license
 */

angular.module('matting-ly.selectionModel').directive('selectionModel', [
  'selectionStack', 'uuidGen', 'selectionModelOptions', '$document',
  function(selectionStack, uuidGen, selectionModelOptions, $document) {
    'use strict';
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {

        /**
         * Defaults from the options provider
         *
         * Use `selectionModelOptionsProvider` when configuring your module to
         * set application wide defaults
         */
        var defaultOptions = selectionModelOptions.get()
          , defaultSelectedAttribute = defaultOptions.selectedAttribute
          , defaultSelectedClass = defaultOptions.selectedClass
          , defaultType = defaultOptions.type
          , defaultMode = defaultOptions.mode
          , defaultCleanupStrategy = defaultOptions.cleanupStrategy;

        /**
         * The selection model type
         *
         * Controls how selections are presented on the underlying element. Use
         * 'basic' (the default) to simplye assign a "selected" class to
         * selected items. If set to 'checkbox' it'll also sync the checked
         * state of the first checkbox child in each underlying `tr` or `li`
         * element.
         *
         * Note that the 'checkbox' type assumes the first input child element
         * will be the checkbox.
         */
        var smType = scope.$eval(attrs.selectionModelType) || defaultType;

        /**
         * The selection mode
         *
         * Supports 'single', 'multi[ple]', and 'multi[ple]-additive'. Single
         * mode will only allow one item to be marked as selected at a time.
         * Vanilla multi mode allows for multiple selectioned items but requires
         * modifier keys to select more than one item at a time. Additive-multi
         * mode allows for multiple items to be selected and will not deselect
         * other items when a vanilla click is made. Additive multi also allows
         * for de-selection without a modifier key (think of `'multi-additive'`
         * as turning every click into a ctrl-click.
         */
        var smMode = scope.$eval(attrs.selectionModelMode) || defaultMode
          , isMultiMode = /^multi(ple)?(-additive)?$/.test(smMode)
          , isModeAdditive = /^multi(ple)?-additive/.test(smMode);

        /**
         * The item attribute to track selected status
         *
         * Use `selection-model-selected-attribute` to override the default
         * attribute.
         */
        var selectedAttribute = scope.$eval(attrs.selectionModelSelectedAttribute) || defaultSelectedAttribute;

        /**
         * The selected class name
         *
         * Will be applied to dom items (e.g. `tr` or `li`) representing
         * selected items. Use `selection-model-selected-class` to override the
         * default class name.
         */
        var selectedClass = scope.$eval(attrs.selectionModelSelectedClass) || defaultSelectedClass;

        /**
         * The cleanup strategy
         *
         * How to handle items that are removed from the current view. By
         * default no action is taken, you may set this to `deselect` to force
         * items to be deselected when they are filtered away, paged away, or
         * otherwise no longer visible on the client.
         */
        var cleanupStrategy = scope.$eval(attrs.selectionModelCleanupStrategy) || defaultCleanupStrategy;

        /**
         * The change callback
         *
         * To be executed whenever the item's selected state changes.
         */
        var smOnChange = attrs.selectionModelOnChange;

        /**
         * The onEnter callback
         *
         * To be executed whenever the user presses Enter
         */
        var smOnEnter = attrs.selectionModelOnEnter;

        /**
         * The list of items
         *
         * selectionModel must be attached to the same element as an ngRepeat
         */
        var repeatLine = attrs.ngRepeat;
        if(!repeatLine) {
          throw 'selectionModel must be used along side ngRepeat';
        }

        /**
         * The list of selected items
         *
         * If used should resolve to an (initially empty) array.  Use this in
         * your view as **read only** if you'd like to do something with just
         * the selected items. Note that order is not guarenteed and any items
         * added to this array programmatically are ignored.
         */
        var selectedItemsList = scope.$eval(attrs.selectionModelSelectedItems);

        /**
         * The last-click stack id
         *
         * There may be multiple selection models on the page and each will need
         * independent click stacks.
         */
        var clickStackId = (function() {
          if(!isMultiMode) {
            return null;
          }
          var idAttr = 'data-selection-model-stack-id';
          // Id may be cached on this element
          var stackId = element.attr(idAttr);
          if(stackId) {
            return stackId;
          }

          // Otherwise it may be on the partent
          stackId = element.parent().attr(idAttr);
          if(stackId) {
            element.attr(idAttr, stackId);
            return stackId;
          }

          // welp guess we're the first, create a new one and cache it on this
          // element (for us) and the parent element (for others)
          stackId = uuidGen.create();
          element.attr(idAttr, stackId);
          element.parent().attr(idAttr, stackId);
          return stackId;
        }());

        /**
         * repeatParts[0] -> The item expression
         * repeatParts[1] -> The collection expression
         * repeatParts[2] -> The track by expression (if present)
         */
        var repeatParts = repeatLine.split(/\sin\s|\strack\sby\s/g)
          , smItem = scope.$eval(repeatParts[0])
          , hasTrackBy = repeatParts.length > 2;

        var isClick = false;

        var findScrollableElement = function() {
          var el = element
            , currentTagName
            , scrollableElementFound
            , scrollableElement = null
            , maxSearchDepth = 5;

          // Recursively search up the parent stack until we find our Tbody/UL/OL
          while (scrollableElementFound !== true && maxSearchDepth > 0) {
            el = el.parent();
            currentTagName = el[0] ? el[0].tagName : '';
            if ('TBODY' === currentTagName || 'UL' === currentTagName || 'OL' === currentTagName) {
              scrollableElementFound = true;
              scrollableElement = el;
            }
            maxSearchDepth--;
          }

          return scrollableElement;
        };
        var scrollableElement = findScrollableElement();

        var updateDom = function() {
          if(smItem[selectedAttribute]) {
            element.addClass(selectedClass);
            if (scrollableElement && !isClick) {
              scrollableElement.scrollToElement(element, 50, 750)
            }
          } else {
            element.removeClass(selectedClass);
          }

          if('checkbox' === smType) {
            var cb = element.find('input');
            cb.prop('checked', smItem[selectedAttribute]);
          }

          isClick = false;
        };

        var getAllVisibleItems = function() {
          return scope.$eval(repeatParts[1]);
        };

        // Strips away filters - this lets us e.g. deselect items that are
        // filtered out
        var getAllItems = function() {
          return scope.$eval(repeatParts[1].split(/[|=]/)[0]);
        };

        // Get us back to a "clean" state. Usually we'll want to skip
        // deselection for items that are about to be selected again to avoid
        // firing the `selection-mode-on-change` handler extra times.
        //
        // `except` param may be `undefined` (deselect all the things), a single
        // item (don't deselect *that* item), or an array of two items (don't
        // deselect anything between those items inclusively).
        var deselectAllItemsExcept = function(except) {
          var useSelectedArray = angular.isArray(selectedItemsList)
            , isRange = angular.isArray(except) && 2 === except.length
            , allItems = getAllItems()
            , numItemsFound = 0
            , doDeselect = false
            , ixItem;
          if(useSelectedArray) {
            selectedItemsList.length = 0;
          }
          angular.forEach(allItems, function(item) {
            if(isRange) {
              ixItem = except.indexOf(item);
              if(ixItem > -1) {
                numItemsFound++;
                doDeselect = false;
                except.splice(ixItem, 1);
              } else {
                doDeselect = 1 !== numItemsFound;
              }
            } else {
              doDeselect = item !== except;
            }
            if(doDeselect) {
              item[selectedAttribute] = false;
            } else {
              if(useSelectedArray && item[selectedAttribute]) {
                selectedItemsList.push(item);
              }
            }
          });
        };

        var selectItemsBetween = function(lastItem) {
          var allItems = getAllVisibleItems()
            , foundLastItem = false
            , foundThisItem = false;

          lastItem = lastItem || smItem;

          angular.forEach(getAllVisibleItems(), function(item) {
            foundThisItem = foundThisItem || item === smItem;
            foundLastItem = foundLastItem || item === lastItem;
            var inRange = (foundLastItem + foundThisItem) === 1;
            if(inRange || item === smItem || item === lastItem) {
              item[selectedAttribute] = true;
            }
          });
        };

        /**
         * Arrow Key Selection
         */
        var doesBaseElementHaveFocus = function() {
          var currentlyFocusedElement = $document[0].activeElement
            , el = element
            , currentTagName
            , baseElementFound
            , baseElement
            , maxSearchDepth = 5;

          // Recursively search up the parent stack until we find our parent Table/UL/OL
          while (baseElementFound !== true && maxSearchDepth > 0) {
            el = el.parent();
            currentTagName = el[0] ? el[0].tagName : '';
            if ('TABLE' === currentTagName || 'UL' === currentTagName || 'OL' === currentTagName) {
              baseElementFound = true;
              baseElement = el;
            }
            maxSearchDepth--;
          }

          if (!baseElement) {
            return false;
          }
          return currentlyFocusedElement === baseElement[0];
        };

        var handleKeypress = function(event) {
          isClick = false;

          var keyCode = event.which || event.keyCode
            , keyPressed;

          switch (keyCode) {
            case (38):
              keyPressed = 'arrowUp';
              break;
            case (40):
              keyPressed = 'arrowDown';
              break;
            case (13):
              keyPressed = 'enter';
              break;
            default:
              return;
          }

          if (!doesBaseElementHaveFocus()) {
            // Don't do anything if our base element is out of focus
            return;
          }

          // If they've pressed the enter key, execute smOnEnter callback
          if (keyPressed === 'enter') {
            scope.$eval(smOnEnter);
            return;
          }

          // Prevent default scrolling behavior (scrolling the browser window)
          event.preventDefault();

          var isCtrlKeyDown = event.ctrlKey || event.metaKey
            , isShiftKeyDown = event.shiftKey;

          var allItems = getAllVisibleItems()
            , maxIx = allItems.length
            , firstItem = selectionStack.peek(clickStackId) ? selectionStack.peek(clickStackId) : allItems[0]
            , currentIx = allItems.indexOf(firstItem)
            , nextItem;

          // Ensure our firstItem is within the list of visible Items
          if (currentIx > -1) {

            if (keyPressed === 'arrowDown' && currentIx +1 <= maxIx) {
              // As long as next item isn't outside the top bounds of our list
              nextItem = allItems[currentIx + 1]
            } else if (keyPressed === 'arrowUp' && currentIx -1 >= 0) {
              // As long as next item isn't outside the bottom bounds of our list
              nextItem = allItems[currentIx - 1]
            }

            if (nextItem) {
              deselectAllItemsExcept(nextItem);
              scope.$apply();

              nextItem[selectedAttribute] = true;
              selectionStack.push(clickStackId, nextItem);
              scope.$apply();
            }
          }

        };

        /**
         * bindKeyPress()
         *
         * Bind the keydown event to our handleKeypress function
         * Only do this once per list of selection-model elements, so flag
         * that we have done so on the parent element once completed for the
         * first time.
         */
        var bindKeypress = function() {
          var keypressAttr = 'data-selection-model-keypress-bound'
            , keypressBound;

          // Look to see if cached on parent
          if (element.parent().attr(keypressAttr)) {
            return;
          }

          // We haven't bound the keypress to the parent element yet
          // Do so now and then cache the attribute
          $document.bind('keydown', handleKeypress);
          element.parent().attr(keypressAttr, true);
        };
        bindKeypress();

        /**
         * Item click handler
         *
         * Use the `ctrl` key to select/deselect while preserving the rest of
         * your selection. Note your your selection mode must be set to
         * `'multiple'` to allow for more than one selected item at a time. In
         * single select mode you still must use the `ctrl` or `shitft` keys to
         * deselect an item.
         *
         * The `shift` key allows you to select ranges of items at a time. Use
         * `ctrl` + `shift` to select a range while preserving your existing
         * selection. In single select mode `shift` behaves like `ctrl`.
         *
         * When an item is clicked with no modifier keys pressed it will be the
         * only selected item.
         *
         * On Mac the `meta` key is treated as `ctrl`.
         *
         * Note that when using the `'checkbox'` selection model type clicking
         * on a checkbox will have no effect on any row other than the one the
         * checkbox is in.
         */
        var handleClick = function(event) {
          isClick = true;

          /**
           * Set by the `selectionModelIgnore` directive
           *
           * Use `selectionModelIgnore` to cause `selectionModel` to selectively
           * ignore clicks on elements. This is useful if you want to manually
           * change a selection when certain things are clicked.
           */
          if(event.selectionModelIgnore || (event.originalEvent && event.originalEvent.selectionModelIgnore)) {
            return;
          }

          // Never handle a single click twice.
          if(event.selectionModelClickHandled || (event.originalEvent && event.originalEvent.selectionModelClickHandled)) {
            return;
          }
          event.selectionModelClickHandled = true;
          if(event.originalEvent) {
            event.originalEvent.selectionModelClickHandled = true;
          }

          var isCtrlKeyDown = event.ctrlKey || event.metaKey || isModeAdditive
            , isShiftKeyDown = event.shiftKey
            , target = event.target || event.srcElement
            , isCheckboxClick = 'checkbox' === smType &&
                'INPUT' === target.tagName &&
                'checkbox' === target.type;

          /**
           * Guard against label + checkbox clicks
           *
           * Clicking a label will cause a click event to also be fired on the
           * associated input element. If that input is nearby (i.e. under the
           * selection model element) we'll suppress the click on the label to
           * avoid duplicate click events.
           */
          if('LABEL' === target.tagName) {
            var labelFor = angular.element(target).attr('for');
            if(labelFor) {
              var childInputs = element[0].getElementsByTagName('INPUT'), ix;
              for(ix = childInputs.length; ix--;) {
                if(childInputs[ix].id === labelFor) {
                  return;
                }
              }
            } else if(target.getElementsByTagName('INPUT').length) {
              // Label has a nested input element, we'll handle the click on
              // that element
              return;
            }
          }

          // Select multiple allows for ranges - use shift key
          if(isShiftKeyDown && isMultiMode && !isCheckboxClick) {
            // Use ctrl+shift for additive ranges
            if(!isCtrlKeyDown) {
              scope.$apply(function() {
                deselectAllItemsExcept([smItem, selectionStack.peek(clickStackId)]);
              });
            }
            selectItemsBetween(selectionStack.peek(clickStackId));
            scope.$apply();
            return;
          }

          // Use ctrl/shift without multi select to true toggle a row
          if(isCtrlKeyDown || isShiftKeyDown || isCheckboxClick) {
            var isSelected = !smItem[selectedAttribute];
            if(!isMultiMode) {
              deselectAllItemsExcept(smItem);
            }
            smItem[selectedAttribute] = isSelected;
            if(smItem[selectedAttribute]) {
              selectionStack.push(clickStackId, smItem);
            }
            scope.$apply();
            return;
          }

          // Otherwise the clicked on row becomes the only selected item
          deselectAllItemsExcept(smItem);
          scope.$apply();

          smItem[selectedAttribute] = true;
          selectionStack.push(clickStackId, smItem);
          scope.$apply();
        };

        /**
         * Routine to keep the list of selected items up to date
         *
         * Adds/removes this item from `selectionModelSelectedItems`.
         */
        var updateSelectedItemsList = function() {
          if(angular.isArray(selectedItemsList)) {
            var ixSmItem = selectedItemsList.indexOf(smItem);
            if(smItem[selectedAttribute]) {
              if(-1 === ixSmItem) {
                selectedItemsList.push(smItem);
              }
            } else {
              if(-1 < ixSmItem) {
                selectedItemsList.splice(ixSmItem, 1);
              }
            }
          }
        };

        // Handle default clicks
        element.on('click', handleClick);
        if('checkbox' === smType) {
          var elCb = element.find('input');
          if(elCb[0] && 'checkbox' === elCb[0].type) {
            element.find('input').on('click', handleClick);
          }
        }

        // We might be coming in with a selection
        updateDom();
        updateSelectedItemsList();

        // If we were given a cleanup strategy then setup a `'$destroy'`
        // listener on the scope.
        if('deselect' === cleanupStrategy) {
          scope.$on('$destroy', function() {
            var oldSelectedStatus = smItem[selectedAttribute];
            smItem[selectedAttribute] = false;
            updateSelectedItemsList();
            if(smOnChange && oldSelectedStatus) {
              scope.$eval(smOnChange);
            }
          });
        }

        scope.$watch(repeatParts[0] + '.' + selectedAttribute, function(newVal, oldVal) {
          // Be mindful of programmatic changes to selected state
          if(newVal !== oldVal) {
            if(!isMultiMode && newVal && !oldVal) {
              deselectAllItemsExcept(smItem);
              smItem[selectedAttribute] = true;
            }
            updateDom();
            updateSelectedItemsList();

            if(smOnChange) {
              scope.$eval(smOnChange);
            }
          }
        });

        // If we're using track-by with ngRepeat it's possible the item
        // reference will change without this directive getting re-linked.
        if(hasTrackBy) {
          scope.$watch(repeatParts[0], function(newVal) {
            smItem = newVal;
          });
        }
      }
    };
  }
]);


/**
 * Default options for the selection model directive
 *
 *
 *
 * @package selectionModel
 */

angular.module('matting-ly.selectionModel').provider('selectionModelOptions', [function() {
  'use strict';

  var options = {
    selectedAttribute: 'selected',
    selectedClass: 'selected',
    type: 'basic',
    mode: 'single',
    cleanupStrategy: 'none'
  };

  this.set = function(userOpts) {
    angular.extend(options, userOpts);
  };

  this.$get = function() {
    var exports = {
      get: function() {
        return angular.copy(options);
      }
    };
    return exports;
  };


}]);


angular.module('matting-ly.selectionModel').service('selectionStack', function() {
  'use strict';
  var exports = {}
    , maxSize = 1000
    , stacks = {};

  exports.push = function(id, item) {
    if(!stacks.hasOwnProperty(id)) {
      stacks[id] = [];
    }
    var stack = stacks[id];
    stack.push(item);
    while(stack.length > maxSize) {
      stack.shift();
    }
    return stack.length;
  };

  exports.pop = function(id) {
    if(!stacks.hasOwnProperty(id)) {
      stacks[id] = [];
    }
    var stack = stacks[id];
    return stack.pop();
  };

  exports.peek = function(id) {
    if(!stacks.hasOwnProperty(id)) {
      stacks[id] = [];
    }
    var stack = stacks[id];
    return stack.length ? stack[stack.length - 1] : undefined;
  };

  return exports;
});

/*jshint bitwise:false */

angular.module('matting-ly.selectionModel').service('uuidGen', function() {
  'use strict';
  var exports = {};
  var uid = ['0', '0', '0'];

  exports.create = function() {
    var index = uid.length;
    var digit;
    while (index) {
      index--;
      digit = uid[index].charCodeAt(0);
      if (digit === 57 /*'9'*/ ) {
        uid[index] = 'A';
        return uid.join('');
      }
      if (digit === 90 /*'Z'*/ ) {
        uid[index] = '0';
      } else {
        uid[index] = String.fromCharCode(digit + 1);
        return uid.join('');
      }
    }
    uid.unshift('0');
    return uid.join('');
  };

  return exports;
});

var duScrollDefaultEasing=function(e){"use strict";return.5>e?Math.pow(2*e,2)/2:1-Math.pow(2*(1-e),2)/2},duScroll=angular.module("duScroll",["duScroll.scrollspy","duScroll.smoothScroll","duScroll.scrollContainer","duScroll.spyContext","duScroll.scrollHelpers"]).value("duScrollDuration",350).value("duScrollSpyWait",100).value("duScrollGreedy",!1).value("duScrollOffset",0).value("duScrollEasing",duScrollDefaultEasing).value("duScrollCancelOnEvents","scroll mousedown mousewheel touchmove keydown").value("duScrollBottomSpy",!1).value("duScrollActiveClass","active");"undefined"!=typeof module&&module&&module.exports&&(module.exports=duScroll),angular.module("duScroll.scrollHelpers",["duScroll.requestAnimation"]).run(["$window","$q","cancelAnimation","requestAnimation","duScrollEasing","duScrollDuration","duScrollOffset","duScrollCancelOnEvents",function(e,t,n,r,o,l,u,c){"use strict";var i={},a=function(e){return"undefined"!=typeof HTMLDocument&&e instanceof HTMLDocument||e.nodeType&&e.nodeType===e.DOCUMENT_NODE},s=function(e){return"undefined"!=typeof HTMLElement&&e instanceof HTMLElement||e.nodeType&&e.nodeType===e.ELEMENT_NODE},d=function(e){return s(e)||a(e)?e:e[0]};i.duScrollTo=function(t,n,r,o){var l;if(angular.isElement(t)?l=this.duScrollToElement:angular.isDefined(r)&&(l=this.duScrollToAnimated),l)return l.apply(this,arguments);var u=d(this);return a(u)?e.scrollTo(t,n):(u.scrollLeft=t,void(u.scrollTop=n))};var f,m;i.duScrollToAnimated=function(e,l,u,i){u&&!i&&(i=o);var a=this.duScrollLeft(),s=this.duScrollTop(),d=Math.round(e-a),p=Math.round(l-s),S=null,g=0,v=this,h=function(e){(!e||g&&e.which>0)&&(c&&v.unbind(c,h),n(f),m.reject(),f=null)};if(f&&h(),m=t.defer(),0===u||!d&&!p)return 0===u&&v.duScrollTo(e,l),m.resolve(),m.promise;var y=function(e){null===S&&(S=e),g=e-S;var t=g>=u?1:i(g/u);v.scrollTo(a+Math.ceil(d*t),s+Math.ceil(p*t)),1>t?f=r(y):(c&&v.unbind(c,h),f=null,m.resolve())};return v.duScrollTo(a,s),c&&v.bind(c,h),f=r(y),m.promise},i.duScrollToElement=function(e,t,n,r){var o=d(this);(!angular.isNumber(t)||isNaN(t))&&(t=u);var l=this.duScrollTop()+d(e).getBoundingClientRect().top-t;return s(o)&&(l-=o.getBoundingClientRect().top),this.duScrollTo(0,l,n,r)},i.duScrollLeft=function(t,n,r){if(angular.isNumber(t))return this.duScrollTo(t,this.duScrollTop(),n,r);var o=d(this);return a(o)?e.scrollX||document.documentElement.scrollLeft||document.body.scrollLeft:o.scrollLeft},i.duScrollTop=function(t,n,r){if(angular.isNumber(t))return this.duScrollTo(this.duScrollLeft(),t,n,r);var o=d(this);return a(o)?e.scrollY||document.documentElement.scrollTop||document.body.scrollTop:o.scrollTop},i.duScrollToElementAnimated=function(e,t,n,r){return this.duScrollToElement(e,t,n||l,r)},i.duScrollTopAnimated=function(e,t,n){return this.duScrollTop(e,t||l,n)},i.duScrollLeftAnimated=function(e,t,n){return this.duScrollLeft(e,t||l,n)},angular.forEach(i,function(e,t){angular.element.prototype[t]=e;var n=t.replace(/^duScroll/,"scroll");angular.isUndefined(angular.element.prototype[n])&&(angular.element.prototype[n]=e)})}]),angular.module("duScroll.polyfill",[]).factory("polyfill",["$window",function(e){"use strict";var t=["webkit","moz","o","ms"];return function(n,r){if(e[n])return e[n];for(var o,l=n.substr(0,1).toUpperCase()+n.substr(1),u=0;u<t.length;u++)if(o=t[u]+l,e[o])return e[o];return r}}]),angular.module("duScroll.requestAnimation",["duScroll.polyfill"]).factory("requestAnimation",["polyfill","$timeout",function(e,t){"use strict";var n=0,r=function(e,r){var o=(new Date).getTime(),l=Math.max(0,16-(o-n)),u=t(function(){e(o+l)},l);return n=o+l,u};return e("requestAnimationFrame",r)}]).factory("cancelAnimation",["polyfill","$timeout",function(e,t){"use strict";var n=function(e){t.cancel(e)};return e("cancelAnimationFrame",n)}]),angular.module("duScroll.spyAPI",["duScroll.scrollContainerAPI"]).factory("spyAPI",["$rootScope","$timeout","$window","$document","scrollContainerAPI","duScrollGreedy","duScrollSpyWait","duScrollBottomSpy","duScrollActiveClass",function(e,t,n,r,o,l,u,c,i){"use strict";var a=function(o){var a=!1,s=!1,d=function(){s=!1;var t,u=o.container,a=u[0],d=0;if("undefined"!=typeof HTMLElement&&a instanceof HTMLElement||a.nodeType&&a.nodeType===a.ELEMENT_NODE)d=a.getBoundingClientRect().top,t=Math.round(a.scrollTop+a.clientHeight)>=a.scrollHeight;else{var f=r[0].body.scrollHeight||r[0].documentElement.scrollHeight;t=Math.round(n.pageYOffset+n.innerHeight)>=f}var m,p,S,g,v,h,y=c&&t?"bottom":"top";for(g=o.spies,p=o.currentlyActive,S=void 0,m=0;m<g.length;m++)v=g[m],h=v.getTargetPosition(),h&&(c&&t||h.top+v.offset-d<20&&(l||-1*h.top+d)<h.height)&&(!S||S[y]<h[y])&&(S={spy:v},S[y]=h[y]);S&&(S=S.spy),p===S||l&&!S||(p&&(p.$element.removeClass(i),e.$broadcast("duScrollspy:becameInactive",p.$element,angular.element(p.getTargetElement()))),S&&(S.$element.addClass(i),e.$broadcast("duScrollspy:becameActive",S.$element,angular.element(S.getTargetElement()))),o.currentlyActive=S)};return u?function(){a?s=!0:(d(),a=t(function(){a=!1,s&&d()},u,!1))}:d},s={},d=function(e){var t=e.$id,n={spies:[]};return n.handler=a(n),s[t]=n,e.$on("$destroy",function(){f(e)}),t},f=function(e){var t=e.$id,n=s[t],r=n.container;r&&r.off("scroll",n.handler),delete s[t]},m=d(e),p=function(e){return s[e.$id]?s[e.$id]:e.$parent?p(e.$parent):s[m]},S=function(e){var t,n,r=e.$scope;if(r)return p(r);for(n in s)if(t=s[n],-1!==t.spies.indexOf(e))return t},g=function(e){for(;e.parentNode;)if(e=e.parentNode,e===document)return!0;return!1},v=function(e){var t=S(e);t&&(t.spies.push(e),t.container&&g(t.container)||(t.container&&t.container.off("scroll",t.handler),t.container=o.getContainer(e.$scope),t.container.on("scroll",t.handler).triggerHandler("scroll")))},h=function(t){var n=S(t);t===n.currentlyActive&&(e.$broadcast("duScrollspy:becameInactive",n.currentlyActive.$element),n.currentlyActive=null);var r=n.spies.indexOf(t);-1!==r&&n.spies.splice(r,1),t.$element=null};return{addSpy:v,removeSpy:h,createContext:d,destroyContext:f,getContextForScope:p}}]),angular.module("duScroll.scrollContainerAPI",[]).factory("scrollContainerAPI",["$document",function(e){"use strict";var t={},n=function(e,n){var r=e.$id;return t[r]=n,r},r=function(e){return t[e.$id]?e.$id:e.$parent?r(e.$parent):void 0},o=function(n){var o=r(n);return o?t[o]:e},l=function(e){var n=r(e);n&&delete t[n]};return{getContainerId:r,getContainer:o,setContainer:n,removeContainer:l}}]),angular.module("duScroll.smoothScroll",["duScroll.scrollHelpers","duScroll.scrollContainerAPI"]).directive("duSmoothScroll",["duScrollDuration","duScrollOffset","scrollContainerAPI",function(e,t,n){"use strict";return{link:function(r,o,l){o.on("click",function(o){if(l.href&&-1!==l.href.indexOf("#")||""!==l.duSmoothScroll){var u=l.href?l.href.replace(/.*(?=#[^\s]+$)/,"").substring(1):l.duSmoothScroll,c=document.getElementById(u)||document.getElementsByName(u)[0];if(c&&c.getBoundingClientRect){o.stopPropagation&&o.stopPropagation(),o.preventDefault&&o.preventDefault();var i=l.offset?parseInt(l.offset,10):t,a=l.duration?parseInt(l.duration,10):e,s=n.getContainer(r);s.duScrollToElement(angular.element(c),isNaN(i)?0:i,isNaN(a)?0:a)}}})}}}]),angular.module("duScroll.spyContext",["duScroll.spyAPI"]).directive("duSpyContext",["spyAPI",function(e){"use strict";return{restrict:"A",scope:!0,compile:function(t,n,r){return{pre:function(t,n,r,o){e.createContext(t)}}}}}]),angular.module("duScroll.scrollContainer",["duScroll.scrollContainerAPI"]).directive("duScrollContainer",["scrollContainerAPI",function(e){"use strict";return{restrict:"A",scope:!0,compile:function(t,n,r){return{pre:function(t,n,r,o){r.$observe("duScrollContainer",function(r){angular.isString(r)&&(r=document.getElementById(r)),r=angular.isElement(r)?angular.element(r):n,e.setContainer(t,r),t.$on("$destroy",function(){e.removeContainer(t)})})}}}}}]),angular.module("duScroll.scrollspy",["duScroll.spyAPI"]).directive("duScrollspy",["spyAPI","duScrollOffset","$timeout","$rootScope",function(e,t,n,r){"use strict";var o=function(e,t,n,r){angular.isElement(e)?this.target=e:angular.isString(e)&&(this.targetId=e),this.$scope=t,this.$element=n,this.offset=r};return o.prototype.getTargetElement=function(){return!this.target&&this.targetId&&(this.target=document.getElementById(this.targetId)||document.getElementsByName(this.targetId)[0]),this.target},o.prototype.getTargetPosition=function(){var e=this.getTargetElement();return e?e.getBoundingClientRect():void 0},o.prototype.flushTargetCache=function(){this.targetId&&(this.target=void 0)},{link:function(l,u,c){var i,a=c.ngHref||c.href;if(a&&-1!==a.indexOf("#")?i=a.replace(/.*(?=#[^\s]+$)/,"").substring(1):c.duScrollspy?i=c.duScrollspy:c.duSmoothScroll&&(i=c.duSmoothScroll),i){var s=n(function(){var n=new o(i,l,u,-(c.offset?parseInt(c.offset,10):t));e.addSpy(n),l.$on("$locationChangeSuccess",n.flushTargetCache.bind(n));var a=r.$on("$stateChangeSuccess",n.flushTargetCache.bind(n));l.$on("$destroy",function(){e.removeSpy(n),a()})},0,!1);l.$on("$destroy",function(){n.cancel(s)})}}}}]);
/**
 * AngularJS fixed header scrollable table directive
 * @author Jason Watmore <jason@pointblankdevelopment.com.au> (http://jasonwatmore.com)
 * @version 1.2.0
 */
(function () {
    angular
        .module('anguFixedHeaderTable', [])
        .directive('fixedHeader', fixedHeader);

    fixedHeader.$inject = ['$timeout'];

    function fixedHeader($timeout) {
        return {
            restrict: 'A',
            link: link
        };

        function link($scope, $elem, $attrs, $ctrl) {
            var elem = $elem[0];

            // wait for data to load and then transform the table
            $scope.$watch(tableDataLoaded, function(isTableDataLoaded) {
                if (isTableDataLoaded) {
                    transformTable();
                }
            });

            function tableDataLoaded() {
                // first cell in the tbody exists when data is loaded but doesn't have a width
                // until after the table is transformed
                var firstCell = elem.querySelector('tbody tr:first-child td:first-child');
                return firstCell && !firstCell.style.width;
            }

            function transformTable() {
                // reset display styles so column widths are correct when measured below
                angular.element(elem.querySelectorAll('thead, tbody, tfoot')).css('display', '');

                // wrap in $timeout to give table a chance to finish rendering
                $timeout(function () {
                    // set widths of columns
                    angular.forEach(elem.querySelectorAll('tr:first-child th'), function (thElem, i) {

                        var tdElems = elem.querySelector('tbody tr:first-child td:nth-child(' + (i + 1) + ')');
                        var tfElems = elem.querySelector('tfoot tr:first-child td:nth-child(' + (i + 1) + ')');

                        var columnWidth = tdElems ? tdElems.offsetWidth : thElem.offsetWidth;
                        if (tdElems) {
                            tdElems.style.width = columnWidth + 'px';
                        }
                        if (thElem) {
                            thElem.style.width = columnWidth + 'px';
                        }
                        if (tfElems) {
                            tfElems.style.width = columnWidth + 'px';
                        }
                    });

                    // set css styles on thead and tbody
                    angular.element(elem.querySelectorAll('thead, tfoot')).css('display', 'block');

                    angular.element(elem.querySelectorAll('tbody')).css({
                        'display': 'block',
                        'height': $attrs.tableHeight || 'inherit',
                        'overflow': 'auto'
                    });

                    // reduce width of last column by width of scrollbar
                    var tbody = elem.querySelector('tbody');
                    var scrollBarWidth = tbody.offsetWidth - tbody.clientWidth;
                    if (scrollBarWidth > 0) {
                        // for some reason trimming the width by 2px lines everything up better
                        scrollBarWidth -= 2;
                        var lastColumn = elem.querySelector('tbody tr:first-child td:last-child');
                        lastColumn.style.width = (lastColumn.offsetWidth - scrollBarWidth) + 'px';
                    }
                });
            }
        }
    }
})();
(function(angular) {

    ProjectsController.$inject = ['$scope', '$http', '$state', '$timeout'];
    function ProjectsController($scope, $http, $state, $timeout) {
        $scope.model = {
            header: 'Projects',
            byline: "A few things I've worked on...",
            headlineImage: '/assets/images/bgs/yellow_flower_sky.jpg',
            projects: []
        };

        $scope.init = function() {
            $scope.getProjects();
        };

        $scope.getProjects = function() {
            $http.get('/api/projects')
                .success(function(data) {
                    $timeout(function() {
                        $scope.model.projects = data;
                    }, 500);
                })
                .error(function(data, status, error, config) {
                    $state.go('error.oops');
                });
        }
    }

    angular.module('matting-ly')
        .controller('ProjectsController', ProjectsController);

})(window.angular);
(function(angular) {

    HomeController.$inject = ['$scope', '$state', '$http', '$timeout'];
    function HomeController($scope, $state, $http, $timeout) {
        $scope.model = {
            header: '',
            byline: '',
            headlineImage: '',
            posts: [],
            postsHaveLoaded: false
        };

        $scope.init = function() {
            $scope.model.header = 'Zane Mattingly';
            $scope.model.byline = 'Full-stack Developer';
            $scope.model.headlineImage = '/assets/images/bgs/robot.jpg';
            $scope.getPosts();
        };

        $scope.getPosts = function() {
            $http.get('/api/posts')
                .success(function(data) {
                    $timeout(function() {
                        $scope.model.postsHaveLoaded = true;
                        $scope.model.posts = data;
                    }, 500);
                })
                .error(function(data, status, error, config) {
                    $state.go('error.oops');
                });
        };
    }

    angular.module('matting-ly')
        .controller('HomeController', HomeController);

})(window.angular);
(function(angular) {

    AboutController.$inject = ['$scope', '$http', '$timeout'];
    function AboutController($scope, $http, $timeout) {
        $scope.model = {
            header: '',
            byline: '',
            headlineImage: ''
        };

        $scope.init = function() {
            $scope.model.header = 'About';
            $scope.model.byline = 'A few things about me';
            $scope.model.headlineImage = '/assets/images/bgs/rings.jpg';
            $scope.getBio();
        };

        $scope.getBio = function() {
            $http.get('/api/bio')
                .success(function(data) {
                    $timeout(function() {
                        $scope.model.bio = data;
                    }, 500);
                })
                .error(function(data, status, error, config) {
                    $state.go('error.oops');
                });
        }
    }

    angular.module('matting-ly')
        .controller('AboutController', AboutController);
})(window.angular);
(function(angular) {

    config.$inject = ['$urlRouterProvider', '$locationProvider', '$httpProvider', '$stateProvider'];
    function config($urlRouterProvider, $locationProvider, $httpProvider, $stateProvider) {
        // urlRouter
        $urlRouterProvider
            .when('/', '/home')
            .otherwise('/404');

        $locationProvider.html5Mode({
            enabled: true,
            rewriteLinks: false
        });

        // $httpProvider
        $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

        var header = {
            templateUrl: 'assets/partials/layout/header.html',
            controller: 'HeaderController'
        };
        var footer = {
            templateUrl: 'assets/partials/layout/footer.html',
            controller: 'FooterController'
        };

        // Set up the states
        $stateProvider
            // Basic Pages
            .state('pages', {
                abstract: true,
                templateUrl: 'assets/partials/layout/publicWrapper.html'
            })
            .state('pages.home', {
                url: '/home',
                views: {
                    header: header,
                    content: {
                        templateUrl: 'assets/partials/pages/home.html',
                        controller: 'HomeController'
                    },
                    footer: footer
                },
                access: {restricted: false}
            })
            .state('pages.about', {
                url: '/about',
                views: {
                    header: header,
                    content: {
                        templateUrl: 'assets/partials/pages/about.html',
                        controller: 'AboutController'
                    },
                    footer: footer
                },
                access: {restricted: false}
            })
            .state('pages.projects', {
                url: '/projects',
                views: {
                    header: header,
                    content: {
                        templateUrl: 'assets/partials/pages/projects.html',
                        controller: 'ProjectsController'
                    },
                    footer: footer
                },
                access: {restricted: false}
            })

            // Auth
            .state('auth', {
                abstract: true,
                templateUrl: 'assets/partials/layout/publicWrapper.html',
                url: '/auth'
            })
            // Registration, etc, for non-admin users to come to later

            // Admin
            .state('admin', {
                abstract: true,
                templateUrl: 'assets/partials/layout/adminWrapper.html',
                url: '/admin',
            })
            .state('admin.viewPosts', {
                url: '/posts',
                views: {
                    header: header,
                    content: {
                        templateUrl: 'assets/partials/admin/posts/viewPosts.html',
                        controller: 'ViewPostsController'
                    },
                    footer: footer
                },
                access: {restricted: true}
            })
            .state('admin.newPost', {
                url: '/posts/new',
                views: {
                    header: header,
                    content: {
                        templateUrl: 'assets/partials/admin/posts/newPost.html',
                        controller: 'NewPostController'
                    },
                    footer: footer
                },
                access: {restricted: true}
            })
            .state('admin.editPost', {
                url: '/posts/:postId',
                views: {
                    header: header,
                    content: {
                        templateUrl: 'assets/partials/admin/posts/editPost.html',
                        controller: 'EditPostController'
                    },
                    footer: footer
                },
                access: {restricted: true}
            })

            // Error
            .state('error', {
                abstract: true,
                templateUrl: 'assets/partials/layout/publicWrapper.html'
            })
            .state('error.oops', {
                url: '/uhoh',
                views: {
                    header: header,
                    content: {
                        templateUrl: 'assets/partials/errors/oops.html',
                    },
                    footer: footer
                },
                access: {restricted: false}
            })
            .state('error.404', {
                url: '/404',
                views: {
                    header: header,
                    content: {
                        templateUrl: 'assets/partials/errors/404.html',
                    },
                    footer: footer
                },
                access: {restricted: false}
            })
            .state('error.403', {
                url: '/403',
                views: {
                    header: header,
                    content: {
                        templateUrl: 'assets/partials/errors/403.html',
                    },
                    footer: footer
                },
                access: {restricted: false}
            })
            .state('error.500', {
                url: '/500',
                views: {
                    header: header,
                    content: {
                        templateUrl: 'assets/partials/errors/500.html',
                    },
                    footer: footer
                },
                access: {restricted: false}
            })
    }
    angular.module('matting-ly.routing', ['ui.router'])
        .config(config);

})(window.angular);
(function(angular) {

    MainController.$inject = ['$scope', '$state', '$filter'];
    function MainController($scope, $state, $filter) {
        $scope.state = $state;
        $scope.defaultTinymceOptions = {
            height: 300,
            plugins: 'code hr link media',
            menu: {
                format: {title: 'Format', items: 'bold italic underline strikethrough superscript subscript | formats | removeformat'},
                edit: {title: 'Edit', items: 'undo redo | cut copy paste pastetext | selectall'},
                insert: {title: 'Insert', items: 'link media | hr'},
            },
            toolbar: 'formatselect | undo redo | bold italic | alignleft aligncenter alignright alignjustify | '
                     + 'bullist numlist | indent outdent blockquote | removeformat | code',
        };
    }

    angular.module('matting-ly')
        .controller('MainController', MainController);

})(window.angular);
(function(angular) {

    HeaderController.$inject = ['$scope', 'AuthService'];
    function HeaderController ($scope, AuthService) {
        $scope.model = {
            stateNavs: [],
            isLoggedIn: false
        };

        $scope.init = function() {
            $scope.model.stateNavs = [
                {
                    'sref': 'pages.home',
                    'text': 'Home'
                },
                {
                    'sref': 'pages.about',
                    'text': 'About'
                },
                {
                    'sref': 'pages.projects',
                    'text': 'Projects'
                }
            ];
            $scope.model.isLoggedIn = AuthService.returnFullLoginStatus();
        };
    }

    angular.module('matting-ly')
        .controller('HeaderController', HeaderController);

})(window.angular);
(function(angular) {

    FooterController.$inject = ['$scope'];
    function FooterController($scope) {
        $scope.model = {
            socialNavs: [],
            poweredByLines: [],
            poweredBy: ''
        };
        $scope.init = function() {
            $scope.model.socialNavs = [
                {
                    alt: 'LinkedIn',
                    img_src: '/assets/images/social_logos/linkedin.png',
                    href: 'https://linkedin.com/in/zanemattingly'
                },
                {
                    alt: 'Github',
                    img_src: '/assets/images/social_logos/github.png',
                    href: 'https://github.com/zmattingly'
                },
                {
                    alt: 'Instagram',
                    img_src: '/assets/images/social_logos/instagram.png',
                    href: 'https://instagram.com/zmattingly'
                },
                {
                    alt: 'Twitter',
                    img_src: '/assets/images/social_logos/twitter.png',
                    href: 'https://twitter.com/z_mattingly'
                }
            ];
            $scope.model.poweredByLines = [
                "viewers like you",
                "the efforts of a small, earnest bird",
                "curious electromagnetic behavior",
                "a chest-mounted arc reactor",
                "thirteen tubas sounding in rhythm",
                "IMMENSE hydraulic pressure",
                "pressurized, super-heated steam",
                "a power-generating stationary bike",
                "bees. Hundreds of bees",
                "a potato",
                "the love inside you",
                "our insect overlords",
                "funky yeasts",
                "three hundred dogs synced in parallel",
                "static electricity",
                "the harnessed gravity of a black hole",
            ];
            $scope.model.poweredBy = $scope.getPoweredBy();
        };
        $scope.getPoweredBy = function() {
            return $scope.model.poweredByLines[Math.floor(Math.random()*($scope.model.poweredByLines.length - 1))];
        };
    }

    angular.module('matting-ly')
        .controller('FooterController', FooterController);

})(window.angular);
(function(angular) {

    yesNo.$inject = [];
    function yesNo() {
        return function (input) {
            return input ? 'Yes' : 'No';
        };
    }

    angular.module("matting-ly")
        .filter("yesNo", yesNo)
    ;

})(window.angular);
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
(function(angular) {

    trust.$inject = ['$sce'];
    function trust($sce) {
        return function(htmlCode) {
            return $sce.trustAsHtml(htmlCode);
        }
    }

    angular.module("matting-ly")
        .filter("trust", trust);

})(window.angular);
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
(function(angular) {

    LoginController.$inject = ['$scope', '$state', 'AuthService']
    function LoginController($scope, $state, AuthService) {
        $scope.model = {
            error: '',
            disabled: false,
            loginForm: {
                username: '',
                password: ''
            },
            isLoggedIn: false
        };

        $scope.init = function() {
            if (AuthService.isLoggedIn()) {
               $state.go('admin.viewPosts');
            } else {
                AuthService.getAccountStatus()
                    .then(function(){
                        if (AuthService.isLoggedIn()) {
                            $state.go('admin.viewPosts');
                        }
                    });
            }
        };

        $scope.dropdownInit = function() {
            AuthService.getAccountStatus()
                .then(function(){
                    $scope.model.isLoggedIn = AuthService.isLoggedIn();
                });
        };

        $scope.login = function () {
            $scope.model.error = '';
            $scope.model.disabled = true;

            // call login from service
            AuthService.login($scope.model.loginForm.username, $scope.model.loginForm.password)
                // handle success
                .then(function () {
                    $state.go('admin.viewPosts');
                })
                // handle error
                .catch(function () {
                    $scope.model.error = "Invalid username and/or password";
                    $scope.model.disabled = false;
                    $scope.model.loginForm = {};
                });

        };

        $scope.logout = function() {
            AuthService.logout()
                // handle success
                .then(function() {
                    $state.go('pages.home', {}, { reload: true });
                })
                // handle error
                .catch(function() {
                    $state.go('error.oops');
                })
        };
    }

    angular.module('matting-ly')
        .controller('LoginController', LoginController);

})(window.angular);
(function(angular) {

    AuthService.$inject = ['$q', '$timeout', '$http'];
    function AuthService($q, $timeout, $http) {
        var user = false;

        function returnFullLoginStatus() {
            getAccountStatus()
                .then(function(){
                    return isLoggedIn();
                });
        }

        function isLoggedIn() {
            return user;
        }

        function getAccountStatus() {
            return $http.get('/auth/account')
                // handle success
                .success(function (data) {
                    if (data._id) {
                        user = true;
                    } else {
                        user = false;
                    }
                })
                // handle error
                .error(function (data) {
                    user = false;
                });
        }

        function login(username, password) {
            var deferred = $q.defer();

            $http.post('/auth/login', {
                username: username,
                password: password
            }).success(function(data, status) {
                if (status == 200 && data.status) {
                    user = true;
                    deferred.resolve();
                } else {
                    user = false;
                    deferred.reject();
                }
            }).error(function(data) {
                user = false;
                deferred.reject();
            });

            return deferred.promise;
        }

        function logout() {
            var deferred = $q.defer();

            $http.get('/auth/logout')
                .success(function(data) {
                    user = false;
                    deferred.resolve();
                }).error(function(data) {
                    user = false;
                    deferred.reject();
                });

            return deferred.promise;
        }

        function register(username, password) {
            var deferred = $q.defer();

            $http.post('/auth/register', {
                username: username,
                password: password
            }).success(function(data, status) {
                if (status == 200 && data.status) {
                    deferred.resolve();
                } else {
                    deferred.reject();
                }
            }).error(function(data) {
                deferred.reject();
            });

            return deferred.promise;
        }

        // return available functions for use in the controllers
        return ({
            isLoggedIn: isLoggedIn,
            getAccountStatus: getAccountStatus,
            returnFullLoginStatus: returnFullLoginStatus,
            login: login,
            logout: logout,
            register: register
        });
    }

    angular.module('matting-ly')
        .factory('AuthService', AuthService);

})(window.angular);