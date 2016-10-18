(function() {

    angular.module('matting-ly.routing', ['ui.router'])
        .config(['$urlRouterProvider', '$locationProvider', '$httpProvider', '$stateProvider',
            function ($urlRouterProvider, $locationProvider, $httpProvider, $stateProvider) {
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
                    templateUrl: 'assets/partials/header.html',
                    controller: 'HeaderController'
                };
                var footer = {
                    templateUrl: 'assets/partials/footer.html',
                    controller: 'FooterController'
                };

                // Set up the states
                $stateProvider
                    // Basic Pages
                    .state('basic', {
                        abstract: true,
                        templateUrl: 'assets/partials/common/basic.html'
                    })
                    .state('basic.home', {
                        url: '/home',
                        views: {
                            header: header,
                            content: {
                                templateUrl: 'assets/partials/home.html',
                                controller: 'HomeController'
                            },
                            footer: footer
                        }
                    })
                    .state('basic.about', {
                        url: '/about',
                        views: {
                            header: header,
                            content: {
                                templateUrl: 'assets/partials/about.html',
                                controller: 'AboutController'
                            },
                            footer: footer
                        }
                    })
                    .state('basic.projects', {
                        url: '/projects',
                        views: {
                            header: header,
                            content: {
                                templateUrl: 'assets/partials/projects.html',
                                controller: 'ProjectsController'
                            },
                            footer: footer
                        }
                    })

                    // Error
                    .state('error', {
                        abstract: true,
                        templateUrl: 'assets/partials/common/basic.html'
                    })
                    .state('error.404', {
                        url: '/404',
                        views: {
                            header: header,
                            content: {
                                templateUrl: 'assets/partials/404.html',
                            },
                            footer: footer
                        }
                    })
            }]
        );

})();