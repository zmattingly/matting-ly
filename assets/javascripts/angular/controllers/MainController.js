(function (angular) {
    angular.module('matting-ly')
        .controller('MainController', ['$scope', '$rootScope', '$state', '$filter', 'AlertService',
            function ($scope, $rootScope, $state, $filter, AlertService) {
                $scope.state = $state;

                $scope.defaultTinymceOptions = {
                    height: 300,
                    plugins: 'code hr link media',
                    menu: {
                        format: {title: 'Format', items: 'bold italic underline strikethrough superscript subscript | formats | removeformat'},
                        edit: {title: 'Edit', items: 'undo redo | cut copy paste pastetext | selectall'},
                        insert: {title: 'Insert', items: 'link media | hr'},
                    },
                    toolbar: 'formatselect | undo redo | bold italic | alignleft aligncenter alignright alignjustify | '
                             + 'bullist numlist | indent outdent blockquote | removeformat | code'
                }

                // Root binding for AlertService
                $rootScope.closeAlert = AlertService.closeAlert;

                $scope.htmlToPlaintext = function($html) {
                    return $filter('htmlToPlaintext')($html);
                }
            }
    ]);
})(window.angular);