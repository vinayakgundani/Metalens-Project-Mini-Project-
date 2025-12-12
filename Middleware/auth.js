module.exports.mustLogin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "You must login first!");
        return res.redirect("/signin");
    }
    next();
};

module.exports.mustLogout = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect("/dashboard");
    }
    next();
};
