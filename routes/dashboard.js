const express = require("express");
const router = express.Router({ mergeParams: true });

router.get("/", (req, res) => {
    res.render("home/dashboard", { bodyClass: "home-page" });

})
module.exports = router;