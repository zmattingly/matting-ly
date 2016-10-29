describe('FooterController', function() {
    var scope, createController;

    beforeEach(module('matting-ly'));
    beforeEach(inject(function ($rootScope, $controller) {
        scope = $rootScope.$new();
        createController = function() {
            return $controller('FooterController', {
                '$scope': scope
            });
        };
    }));

    it('should exist', function() {
        var controller = createController();
        expect(controller).toBeDefined();
    });
    it('should set scope "model.poweredBy" to a random string from "model.poweredByLines', function() {
        var controller = createController();
        expect(scope.model.poweredBy).toEqual('');
        scope.init();
        expect(scope.model.poweredByLines).toEqual(jasmine.any(Array));
        expect(scope.model.poweredByLines).toContain(scope.model.poweredBy);
        expect(scope.model.poweredBy).toEqual(jasmine.any(String));
    });
    it('should have scope "model.socialNavs" contain alt, img_src, and href keys', function() {
        var controller = createController();
        scope.init();
        expect(scope.model.socialNavs).toEqual(jasmine.any(Array));
        expect(scope.model.socialNavs[0]).toEqual(jasmine.any(Object));
        expect(Object.keys(scope.model.socialNavs[0]).sort()).toEqual(['alt', 'img_src', 'href'].sort());
    });
});