(function(angular) {
    angular.module('matting-ly.selectionTable', [
        'selectionModel',            // angular-selection-model - zmattingly forked version
        'anguFixedHeaderTable',       // angu-fixed-header-table
        "mattingly/selectionTable/template/selectionTable.html"
    ]);
})(window.angular);
