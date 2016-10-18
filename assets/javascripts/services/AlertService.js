(function () {
    angular.module('matting-ly').factory('AlertService', ['$rootScope',
        function($rootScope) {
            var alertService = {};

            // create an array of alerts available globally
            $rootScope.alerts = [];

            alertService.add = function(type, msg, dismiss) {
                $rootScope.alerts.push({'type': type, 'msg': msg, 'dismiss': dismiss || undefined });
            };

            alertService.closeAlert = function(index) {
                $rootScope.alerts.splice(index, 1);
            };

            return alertService;
        }
    ]);
})();