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
            // Local Libs
            // {src: staticDir + '/javascripts/libs/angular-scroll/angular-scroll.min.js'},
            // {src: staticDir + '/javascripts/libs/angular-selection-model/matting-ly-selection-model.js'},
            // {src: staticDir + '/javascripts/libs/angu-fixed-header-table/angu-fixed-header-table.js'},
            // {src: staticDir + '/javascripts/libs/matting-ly-selectiontable/matting-ly-selectiontable.js'},
            // {src: staticDir + '/javascripts/libs/angular-ui-tinymce/tinymce.min.js'},
        ],
        staticDir: '/assets',
        javascripts: [
            {src: staticDir + '/js/all.min.js'},
            // Main
            // {src: staticDir + '/javascripts/angular/main.js'},
            // {src: staticDir + '/javascripts/angular/routing.js'},
            // {src: staticDir + '/javascripts/angular/filters.js'},
            // // Basic Directives
            // {src: staticDir + '/javascripts/angular/directives/directives.js'},
            // // matting-ly.selectionTable
            // // Controllers
            // {src: staticDir + '/javascripts/angular/controllers/MainController.js'},
            // {src: staticDir + '/javascripts/angular/controllers/HeaderController.js'},
            // {src: staticDir + '/javascripts/angular/controllers/FooterController.js'},
            //     // Pages
            //     {src: staticDir + '/javascripts/angular/controllers/pages/HomeController.js'},
            //     {src: staticDir + '/javascripts/angular/controllers/pages/AboutController.js'},
            //     {src: staticDir + '/javascripts/angular/controllers/pages/ProjectsController.js'},
            //     // Auth
            //     {src: staticDir + '/javascripts/angular/controllers/auth/LoginController.js'},
            //     // Admin
            //     {src: staticDir + '/javascripts/angular/controllers/admin/posts/ViewPostsController.js'},
            //     {src: staticDir + '/javascripts/angular/controllers/admin/posts/EditPostController.js'},
            //     {src: staticDir + '/javascripts/angular/controllers/admin/posts/NewPostController.js'},
            // // Services
            // {src: staticDir + '/javascripts/angular/services/AuthService.js'},
            // {src: staticDir + '/javascripts/angular/services/AlertService.js'},
            // {src: staticDir + '/javascripts/angular/services/SafeApply.js'}
        ]
    });
});

module.exports = router;
