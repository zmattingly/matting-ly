// ensureAuthenticated Middleware Function
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    console.log("Not Authenticated!");
    res.redirect('/404');
}

// ensureAdmin Middleware Function
function ensureAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.admin) {
        return next();
    }
    res.redirect('/403');
}

var middleware = {
    'ensureAdmin': ensureAdmin,
    'ensureAuthenticated': ensureAuthenticated,
};

module.exports = middleware;
