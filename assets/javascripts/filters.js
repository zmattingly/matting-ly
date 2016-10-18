(function (angular) {
    var app = angular.module("matting-ly");

    app.filter("trust", ['$sce', function($sce) {
        return function(htmlCode) {
            return $sce.trustAsHtml(htmlCode);
        }
    }]);

})(window.angular);