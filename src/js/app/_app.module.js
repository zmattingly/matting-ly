(function (angular) {
    var app = angular.module('matting-ly', [
        'matting-ly.routing',        // matting-ly Angular UI Router and config
        'matting-ly.selectionTable', // selectionTable
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
                            $state.go('public.home');
                        }
                    });
            }
        );
    }

    app.run(run)
        ;
})(window.angular);