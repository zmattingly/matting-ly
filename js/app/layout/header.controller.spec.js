describe('HeaderController', function() {
    var scope, createController;
    var mockedAuthService = {
        returnFullLoginStatus: jasmine.createSpy('spy'),
    };

    beforeEach(function() {
        module('matting-ly', function($provide) {
            $provide.factory('AuthService', function() { return mockedAuthService});
        });
    });
    beforeEach(inject(function ($rootScope, $controller) {
        scope = $rootScope.$new();
        createController = function() {
            return $controller('HeaderController', {
                '$scope': scope
            });
        };
    }));

    it('should exist', function() {
        var controller = createController();
        expect(controller).toBeDefined();
    });
    it('should have scope "model.stateNavs" contain sref and text keys', function() {
        var controller = createController();
        expect(scope.model.stateNavs).toEqual([]);
        // Execute Init to set values
        scope.init();
        expect(scope.model.stateNavs).toEqual(jasmine.any(Array));
        expect(scope.model.stateNavs[0]).toEqual(jasmine.any(Object));
        expect(Object.keys(scope.model.stateNavs[0]).sort()).toEqual(['sref', 'text'].sort());
    });
    it('should set "model.isLoggedIn" to false without auth service login', function() {
        var controller = createController();
        expect(scope.model.isLoggedIn).toEqual(false);
        mockedAuthService.returnFullLoginStatus.and.returnValue(false);
        scope.model.isLoggedIn = true;
        // Execute Init to set values
        scope.init();
        expect(mockedAuthService.returnFullLoginStatus).toHaveBeenCalled();
        expect(scope.model.isLoggedIn).toEqual(false);
    });
});