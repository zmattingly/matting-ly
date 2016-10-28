(function(angular) {

    FooterController.$inject = ['$scope'];
    function FooterController($scope) {
        $scope.model = {
            socialNavs: [],
            poweredByLines: [],
            poweredBy: ''
        };
        $scope.init = function() {
            $scope.model.socialNavs = [
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
            $scope.model.poweredByLines = [
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
            $scope.model.poweredBy = $scope.getPoweredBy();
        };
        $scope.getPoweredBy = function() {
            return $scope.model.poweredByLines[Math.floor(Math.random()*($scope.model.poweredByLines.length - 1))];
        };
    }

    angular.module('matting-ly')
        .controller('FooterController', FooterController);

})(window.angular);