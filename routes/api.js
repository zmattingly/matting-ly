var express = require('express');
var router = express.Router();
var middleware = require('../middleware');

// Models
var models = {};
models.Post = require('../models/post');
models.Project = require('../models/project');
models.Bio = require('../models/bio');

// Routes
router.get('/restricted', middleware.ensureAdmin, function(req, res, next) {
    var restricted = [
        {
            text: "Restricted Content"
        }
    ];
    res.status(200).json(restricted);
});

// Posts
router.get('/posts', function(req, res, next) {
    // Public Get, only Published Posts
    models.Post.find({ published: true }).sort({'date': -1}).limit(5)
        .exec(defaultFindExec(res));
});
router.post('/posts', middleware.ensureAdmin, function(req, res, next) {
    var postData = req.body;
    var newPost = new models.Post(postData);

    var error = newPost.validateSync();
    if (error) {
        return res.status(400).json({ error: error });
    } else {
        newPost.save();
        return res.status(200).json(newPost);
    }
});
router.get('/posts/all', middleware.ensureAdmin, function(req, res, next) {
    // Private Get, both Published and Non-Published, no-limit
    models.Post.find({}).sort({'date': -1})
        .exec(defaultFindExec(res));
});

// Posts by ID
router.get('/posts/:postId', function(req, res, next) {
    models.Post.findOne({ _id: req.params.postId })
        .exec(defaultFindExec(res));
});
router.put('/posts/:postId', middleware.ensureAdmin, function(req, res, next) {
    var postData = req.body;

    models.Post.findOneAndUpdate({ _id: postData._id }, postData, { new: true, runValidators: true }, function(err, doc) {
        if (err) {
            return res.status(400).json({ error: err });
        }
        return res.status(200).json({
            success: "Updated post record successfully.",
            doc: doc
        });
    });
});
router.delete('/posts/:postId', middleware.ensureAdmin, function(req, res, next) {
    var postId = req.params.postId;

    models.Post.findByIdAndRemove(postId, function(err) {
        if (err) {
            res.status(400).json({ error: err });
        } else {
            res.status(200).json({ success: "Post "+postId+" successfully removed."})
        }
    });
});

// Bio
router.get('/bio', function(req, res, next) {
    models.Bio.findOne({})
        .exec(defaultFindExec(res));
});
router.put('/bio', middleware.ensureAdmin, function(req, res, next) {
    var bioData = req.body;

    models.Bio.findOneAndUpdate({ _id: bioData._id }, bioData, { new: true, runValidators: true }, function(err, doc) {
        if (err) {
            return res.status(400).json({ error: err });
        }
        return res.status(200).json({
            success: "Updated bio record successfully.",
            doc: doc
        });
    });
});

// Projects
router.get('/projects', function(req, res, next) {
    models.Project.find({}).sort({'date': -1})
        .exec(defaultFindExec(res));
});

var defaultFindExec = function(res) {
    return function(err, content) {
        if (err) {
            res.status(400).json({ error: err });
        } else {
            res.status(200).json(content);
        }
    };
};


module.exports = router;
