(function (angular) {
    angular.module('matting-ly')
        .controller('FooterController', ['$scope',
            function ($scope) {
                $scope.socialNavs = [
                    {
                        alt: 'LinkedIn',
                        img_src: '/assets/images/social_logos/linkedin.png',
                        href: 'https://linkedin.com/in/zanemattingly'
                    },
                    {
                        alt: 'Github',
                        img_src: '/assets/images/social_logos/github.png',
                        href: 'https://github.com/zmattingly'
                    },
                    {
                        alt: 'Instagram',
                        img_src: '/assets/images/social_logos/instagram.png',
                        href: 'https://instagram.com/zmattingly'
                    },
                    {
                        alt: 'Twitter',
                        img_src: '/assets/images/social_logos/twitter.png',
                        href: 'https://twitter.com/z_mattingly'
                    }
                ];
                $scope.poweredBy = '';

                var poweredByLines = [
                    "viewers like you",
                    "the efforts of a small, earnest bird",
                    "curious electromagnetic behavior",
                    "a chest-mounted arc reactor",
                    "thirteen tubas sounding in rhythm",
                    "IMMENSE hydraulic pressure",
                    "pressurized, super-heated steam",
                    "a power-generating stationary bike",
                    "bees. Hundreds of bees",
                    "a potato",
                    "the love inside you",
                    "our insect overlords",
                    "funky yeasts",
                    "three hundred dogs synced in parallel",
                    "static electricity",
                    "the harnessed gravity of a black hole",
                ];
                $scope.init = function() {
                    $scope.poweredBy = $scope.getPoweredBy();
                }
                $scope.getPoweredBy = function() {
                    return poweredByLines[Math.floor(Math.random()*(poweredByLines.length - 1))];
                };
            }
    ]);
})(window.angular);