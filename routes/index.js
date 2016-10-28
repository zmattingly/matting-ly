var express = require('express');
var router = express.Router();

var staticDir = '/assets';

/*
ALWAYS GET home page.
AngularJS routing takes care of the rest.
*/
router.get('*', function(req, res, next) {
    res.render('index', {
        title: 'z.matting.ly',
        stylesheets: [
            {href: staticDir + '/css/all.css' },
            // {href: staticDir + '/stylesheets/style.css'},
            {href: 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css'},
            {href: 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css'},
            {href: 'https://cdnjs.cloudflare.com/ajax/libs/textAngular/1.5.12/textAngular.min.css'},
            {href: 'https://cdnjs.cloudflare.com/ajax/libs/spinkit/1.2.5/spinners/9-cube-grid.min.css'}
        ],
        libJavascripts: [
            {src: '//cdn.tinymce.com/4/tinymce.min.js'},
            {src: 'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.8/angular.min.js'},
            {src: 'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.8/angular-animate.min.js'},
            {src: 'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.8/angular-touch.min.js'},
            {src: 'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.8/angular-resource.min.js'},
            {src: 'https://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/2.2.0/ui-bootstrap.min.js'},
            {src: 'https://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/2.2.0/ui-bootstrap-tpls.min.js'},
            {src: 'https://cdnjs.cloudflare.com/ajax/libs/angular-ui-router/0.3.1/angular-ui-router.min.js'},
        ],
        staticDir: '/assets',
        javascripts: [
            {src: staticDir + '/js/all.min.js'},
        ]
    });
});

module.exports = router;
