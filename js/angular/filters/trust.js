(function (angular) {

    var trust = ['$sce', function($sce) {
        return function(htmlCode) {
            return $sce.trustAsHtml(htmlCode);
        }
    }];

    angular.module("matting-ly")
        .filter("trust", trust);

})(window.angular);