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