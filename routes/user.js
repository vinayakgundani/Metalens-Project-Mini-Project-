const express = require("express");
const router = express.Router({ mergeParams: true });
const user = require("../Models/User");
const e = require("connect-flash");
const passport = require("passport");


router.get("/signup", (req, res) => {
    res.render("users/signup", { bodyClass: "auth-page" });
    // include folder path inside views
});

router.get("/signin", (req, res) => {

    res.render("users/signin", { bodyClass: "auth-page" });

});


router.post("/signin", passport.authenticate("local", {
    failureRedirect: "/signin",
    failureFlash: true,
}), async(req, res) => {
    req.flash("success", "welcome back to dashboard");
    return res.redirect("/dashboard");

});


router.post("/signup", async(req, res) => {
    try {
        const { email, password, username } = req.body;
        const newuser = new user({ email, username });

        const registereduser = await user.register(newuser, password);
        console.log("Registered:", registereduser);
        req.flash("success", "user registered sucessfully");
        return res.redirect("/signin");

    } catch (err) {
        req.flash("error", err.message);
        return res.redirect("/signup");

    }
});



module.exports = router;