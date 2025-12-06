const express = require("express");
const router = express.Router();
const user = require("../Models/User");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

// Step 1: Show forgot password page
router.get("/", (req, res) => {
    res.render("users/forgotpass", { bodyClass: "auth-page" });

});

// Step 2: Handle email submit
router.post("/", async(req, res) => {
    const { email } = req.body;
    const User = await user.findOne({ email });

    if (!User) {
        req.flash("error", "Email not found");
        return res.redirect("/forgotpass");

    }

    // create token
    const token = crypto.randomBytes(20).toString("hex");

    User.resetToken = token;
    User.resetExpire = Date.now() + 30 * 60 * 1000; // 30 minutes
    await User.save();

    const link = `http://localhost:8089/forgotpass/${token}`;

    await sendEmail(email, "Reset Password", `Click this link to reset password: ${link}`);

    req.flash("success", "Reset link sent to your email");
    return res.redirect("/forgotpass");
});

// Step 3: Show reset password page
router.get("/:token", async(req, res) => {
    const { token } = req.params;

    const User = await user.findOne({
        resetToken: token,
        resetExpire: { $gt: Date.now() }
    });

    if (!User) {
        req.flash("error", "Invalid or expired link");
        return res.redirect("/forgotpass");
    }

    res.render("users/reset", { token, bodyClass: "auth-page" });

});

// Step 4: Save new password
router.post("/:token", async(req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const User = await user.findOne({
        resetToken: token,
        resetExpire: { $gt: Date.now() }
    });

    if (!User) {
        req.flash("error", "Link expired. Try again.");
        return res.redirect("/forgotpass");

    }

    await User.setPassword(password);
    User.resetToken = undefined;
    User.resetExpire = undefined;
    await User.save();

    req.flash("success", "Password updated successfully");
    return res.redirect("/signin");
});

module.exports = router;