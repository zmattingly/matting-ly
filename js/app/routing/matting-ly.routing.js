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
                    templateUrl: 'assets/partials/layout/header.html',
                    controller: 'HeaderController'
                };
                var footer = {
                    templateUrl: 'assets/partials/layout/footer.html',
                    controller: 'FooterController'
                };

                // Set up the states
                $stateProvider
                    // Basic Pages
                    .state('pages', {
                        abstract: true,
                        templateUrl: 'assets/partials/layout/publicWrapper.html'
                    })
                    .state('pages.home', {
                        url: '/home',
                        views: {
                            header: header,
                            content: {
                                templateUrl: 'assets/partials/pages/home.html',
                                controller: 'HomeController'
                            },
                            footer: footer
                        },
                        access: {restricted: false}
                    })
                    .state('pages.about', {
                        url: '/about',
                        views: {
                            header: header,
                            content: {
                                templateUrl: 'assets/partials/pages/about.html',
                                controller: 'AboutController'
                            },
                            footer: footer
                        },
                        access: {restricted: false}
                    })
                    .state('pages.projects', {
                        url: '/projects',
                        views: {
                            header: header,
                            content: {
                                templateUrl: 'assets/partials/pages/projects.html',
                                controller: 'ProjectsController'
                            },
                            footer: footer
                        },
                        access: {restricted: false}
                    })

                    // Auth
                    .state('auth', {
                        abstract: true,
                        templateUrl: 'assets/partials/layout/publicWrapper.html',
                        url: '/auth'
                    })
                    // Registration, etc, for non-admin users to come to later

                    // Admin
                    .state('admin', {
                        abstract: true,
                        templateUrl: 'assets/partials/layout/adminWrapper.html',
                        url: '/admin',
                    })
                    .state('admin.viewPosts', {
                        url: '/posts',
                        views: {
                            header: header,
                            content: {
                                templateUrl: 'assets/partials/admin/posts/viewPosts.html',
                                controller: 'ViewPostsController'
                            },
                            footer: footer
                        },
                        access: {restricted: true}
                    })
                    .state('admin.newPost', {
                        url: '/posts/new',
                        views: {
                            header: header,
                            content: {
                                templateUrl: 'assets/partials/admin/posts/newPost.html',
                                controller: 'NewPostController'
                            },
                            footer: footer
                        },
                        access: {restricted: true}
                    })
                    .state('admin.editPost', {
                        url: '/posts/:postId',
                        views: {
                            header: header,
                            content: {
                                templateUrl: 'assets/partials/admin/posts/editPost.html',
                                controller: 'EditPostController'
                            },
                            footer: footer
                        },
                        access: {restricted: true}
                    })

                    // Error
                    .state('error', {
                        abstract: true,
                        templateUrl: 'assets/partials/layout/publicWrapper.html'
                    })
                    .state('error.oops', {
                        url: '/uhoh',
                        views: {
                            header: header,
                            content: {
                                templateUrl: 'assets/partials/errors/oops.html',
                            },
                            footer: footer
                        },
                        access: {restricted: false}
                    })
                    .state('error.404', {
                        url: '/404',
                        views: {
                            header: header,
                            content: {
                                templateUrl: 'assets/partials/errors/404.html',
                            },
                            footer: footer
                        },
                        access: {restricted: false}
                    })
                    .state('error.403', {
                        url: '/403',
                        views: {
                            header: header,
                            content: {
                                templateUrl: 'assets/partials/errors/403.html',
                            },
                            footer: footer
                        },
                        access: {restricted: false}
                    })
                    .state('error.500', {
                        url: '/500',
                        views: {
                            header: header,
                            content: {
                                templateUrl: 'assets/partials/errors/500.html',
                            },
                            footer: footer
                        },
                        access: {restricted: false}
                    })
            }]
        );

})();