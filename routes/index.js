var express = require('express');
var router = express.Router();

var staticDir = '/assets';

/* ALWAYS GET home page.
AngularJS routing takes care of the rest.
*/
router.get('*', function(req, res, next) {
    res.render('index', {
        title: 'z.matting.ly',
        stylesheets: [
            {href: staticDir + '/stylesheets/style.css'},
            {href: 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css'},
            {href: 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css'}
        ],
        libJavascripts: [
            {src: 'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.8/angular.min.js'},
            {src: 'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.8/angular-animate.min.js'},
            {src: 'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.8/angular-touch.min.js'},
            {src: 'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.8/angular-resource.min.js'},
            {src: 'https://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/2.2.0/ui-bootstrap.min.js'},
            {src: 'https://cdnjs.cloudflare.com/ajax/libs/angular-ui-router/0.3.1/angular-ui-router.min.js'},
        ],
        staticDir: '/assets',
        javascripts: [
            // Main
            {src: staticDir + '/javascripts/main.js'},
            {src: staticDir + '/javascripts/routing.js'},
            {src: staticDir + '/javascripts/filters.js'},
            // Controllers
            {src: staticDir + '/javascripts/controllers/MainController.js'},
            {src: staticDir + '/javascripts/controllers/HeaderController.js'},
            {src: staticDir + '/javascripts/controllers/FooterController.js'},
            {src: staticDir + '/javascripts/controllers/HomeController.js'},
            {src: staticDir + '/javascripts/controllers/AboutController.js'},
            {src: staticDir + '/javascripts/controllers/ProjectsController.js'},
            // Services
            {src: staticDir + '/javascripts/services/AlertService.js'},
            {src: staticDir + '/javascripts/services/SafeApply.js'}
        ]
    });
});

module.exports = router;
