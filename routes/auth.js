var express = require('express');
var passport = require('passport');

var Account = require('../models/account');

var middleware = require('../middleware');
var router = express.Router();

router.post('/register', function(req, res) {
    Account.register(new Account({ username: req.body.username }), req.body.password, function(err, account) {
        res.setHeader('Content-Type', 'application/json');
        if (err) {
            return res.status(500).json({
                err: err
            });
        }
        passport.authenticate('local')(req, res, function () {
            return res.status(200).json({
                status: 'Registration successful!'
            });
        });
    });
});

router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, account, info) {
        res.setHeader('Content-Type', 'application/json');
        if (err) {
            return next(err);
        }
        if (!account) {
            return res.status(401).json({
                err: info
            });
        }
        req.logIn(account, function(err) {
            if (err) {
                return res.status(500).json({
                    err: 'Could not log in user'
                });
            }
            res.status(200).json({
                status: 'Login successful!'
            });
        });
    })(req, res, next);
});

router.get('/account', middleware.ensureAuthenticated, function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(req.user);
});

router.get('/logout', function(req, res) {
    req.logout();

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
        status: 'Logged out'
    });
});

module.exports = router;
