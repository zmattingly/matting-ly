(function(angular) {

    MainController.$inject = ['$scope', '$state', '$filter'];
    function MainController($scope, $state, $filter) {
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
                     + 'bullist numlist | indent outdent blockquote | removeformat | code',
        };
    }

    angular.module('matting-ly')
        .controller('MainController', MainController);

})(window.angular);