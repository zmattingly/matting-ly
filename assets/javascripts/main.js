(function (angular) {
    var app = angular.module('matting-ly', [
        'ui.bootstrap',        // Angular UI Bootstrap
        'matting-ly.routing',  // Angular UI Router and config
        'ngResource'           // $sce
    ]);

    var run = ['$rootScope', '$state',
        function ($rootScope, $state) {
            $rootScope.$state = $state;
    }];

    app.run(run)
        .value('duScrollOffset', 64) // Header is 64px tall
        ;
})(window.angular);