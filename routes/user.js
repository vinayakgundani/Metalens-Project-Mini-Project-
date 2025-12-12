const express = require("express");
const router = express.Router();
const user = require("../Models/User");
const passport = require("passport");
const { mustLogin,mustLogout } = require("../Middleware/auth");

router.get("/signup", mustLogout, (req, res) => {
    res.render("users/signup", { bodyClass: "auth-page" });
});

router.get("/signin", mustLogout, (req, res) => {
    res.render("users/signin", { bodyClass: "auth-page" });
});

router.post("/signin",
    mustLogout,
    passport.authenticate("local", {
        failureRedirect: "/signin",
        failureFlash: true,
    }),
    (req, res) => {
        req.flash("success", "Welcome back!");
        res.redirect("/dashboard");
    }
);

router.post("/signup", mustLogout, async (req, res) => {
    try {
        const { email, password, username } = req.body;
        const newUser = new user({ email, username });
        await user.register(newUser, password);

        req.flash("success", "Registration successful!");
        return res.redirect("/signin");
    } catch (err) {
        req.flash("error", err.message);
        return res.redirect("/signup");
    }
});

router.post("/logout", mustLogin, (req, res, next) => {
    req.logout(err => {
        if (err) return next(err);
        req.flash("success", "Logged out successfully");
        res.redirect("/signin");
    });
});

module.exports = router;
