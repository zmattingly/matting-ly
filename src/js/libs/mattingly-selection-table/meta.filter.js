(function(angular) {

    /**
     * Filter: meta
     * @type {function}
     *
     * Filter for passing in a specified filter via interpolation.
     * Use: {{ data.value | meta:data.filter }}
     */

    meta.$inject = ['$filter'];
    function meta($filter) {
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
    }
    angular.module('matting-ly.selectionTable')
        .filter('meta', meta);

}(window.angular));