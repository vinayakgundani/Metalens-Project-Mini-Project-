const express = require("express");
const router = express.Router();
const { mustLogin } = require("../Middleware/auth");

router.get("/", mustLogin, (req, res) => {
    res.render("home/dashboard", { bodyClass: "home-page" });
});

module.exports = router;
