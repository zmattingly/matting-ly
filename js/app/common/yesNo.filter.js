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