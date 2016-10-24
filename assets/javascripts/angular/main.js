(function (angular) {
    var app = angular.module('matting-ly', [
        'matting-ly.routing',        // matting-ly Angular UI Router and config
        'matting-ly.selectionTable', // matting-ly selectionTable
        'ngResource',                // $sce
        'ui.bootstrap',              // Angular UI Bootstrap
        'ui.bootstrap.tpls',         // Angular UI Bootstrap Default Templates
        'textAngular'                // textAngular WYSIWYG
    ]);

    var run = ['$rootScope', '$state', 'AuthService',
        function ($rootScope, $state, AuthService) {
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
    ];

    app.run(run)
        .value('duScrollOffset', 64) // Header is 64px tall
        ;
})(window.angular);