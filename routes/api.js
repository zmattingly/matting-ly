var express = require('express');
var router = express.Router();

router.get('/posts.json', function(req, res, next) {
    var posts = [
        {
            id: 1,
            author: 'Zane',
            heading: 'Hello World',
            date: "2016-10-18T03:45:33.551Z",
            content: '<p>Hey there, thanks for stopping by. Someone said I should probably have a website up, and they\'re probably right. So... Here it is.</p>' +
                     '<p>Nothing too fancy, just a quick spot to stick stuff online. Projects, things that come into my head, etc.</p>' +
                     '<p>For simplicity\'s sake, right now this is hardcoded but I\'m hoping to move the blog entries to a datastore with a basic admin interface for adding new content.</p>' +
                     '<p>You\'ll see an update here when that\'s ready. For now, poke around and feel free to check out the full source at <a href="https://github.com/zmattingly/matting-ly">Github</a>!</p>'
        }
    ];

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(posts));
});

router.get('/projects.json', function(req, res, next) {
    var projects = [
        {
            id: 1,
            heading: 'z.matting.ly',
            summary: 'You\'re looking at it!',
            link: 'https://github.com/zmattingly/matting-ly',
            date: "2016-10-18T00:00:00",
            content: '<p>A simple Webzone for my Blag.</p>' +
                     '<p>Built using Node.js, Express and AngularJS off-and-on over three days. Hosted via Heroku.</p>' +
                     '<p>Features:</p>' +
                     '<ul>' +
                        '<li>Three whole pages.</li>' +
                        '<li>A blog post.</li>' +
                        '<li>This sentence.</li>' +
                        '<li>Links and stuff I guess...</li>' +
                     '</ul>' +
                     '<p>Source available on <a href="https://github.com/zmattingly/matting-ly" title="Github: matting-ly">Github</a>.</p>',
            photos: [
                {
                    alt: 'Code - HTML',
                    src: '/assets/images/projects/matting_ly/01.jpg'
                },
                {
                    alt: 'Code - SASS',
                    src: '/assets/images/projects/matting_ly/02.jpg'
                },
                {
                    alt: 'Code - Javascript',
                    src: '/assets/images/projects/matting_ly/03.jpg'
                }
            ]
        },
        {
            id: 2,
            heading: 'Test Area Zeta: Chamber 01',
            summary: 'A Portal 2 Map',
            link: 'http://steamcommunity.com/sharedfiles/filedetails/?id=68680897',
            date: "2012-05-09T00:00:00",
            content: '<p>A short, sweet, and challenging Test Chamber in a forgotten corner of the Aperture Science Test Facility. The first in a series of Zeta Area Chambers that may or may not be trapped within a collapsing valve-time zero-point singularity bubble.</p>' +
                     '<p>Built using Valve Software\'s Hammer map editor and SDK over the course of two months.</p>' +
                     '<p>Features:</p>' +
                     '<ul>' +
                        '<li>3D Geometry (Gee Whiz!)</li>' +
                        '<li>A full 3D Skybox with volumetric fog.</li>' +
                        '<li>A sequence of 5 cunning puzzles in series.</li>' +
                        '<li>A context-aware, responsive soundtrack (original music: Valve\'s).</li>' +
                        '<li>Lasers, Repulsion Gel, Cubes, Deadly Slime.</li>' +
                     '</ul>' +
                     '<p>Available at the <a href="http://steamcommunity.com/sharedfiles/filedetails/?id=68680897" title="Test Area Zeta: Chamber 01">Steam Workshop</a>.</p>',
            photos: [
                {
                    alt: 'Zeta 01 - 01',
                    src: '/assets/images/projects/test_area_zeta/01.jpg'
                },
                {
                    alt: 'Zeta 01 - 02',
                    src: '/assets/images/projects/test_area_zeta/02.jpg'
                }
            ]
        }
    ];

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(projects));
});

module.exports = router;
