const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const { mustLogin } = require("../Middleware/auth");

const upload = multer({ dest: "uploads/" });

if (!fs.existsSync("converted")) fs.mkdirSync("converted");

router.get("/", mustLogin, (req, res) => {
    res.render("Convert/index", { bodyClass: "auth-page" });
});

router.post("/process", mustLogin, upload.single("image"), async (req, res) => {
    try {
        const file = req.file;
        const format = req.body.format;

        const outputName = `${Date.now()}-${path.parse(file.originalname).name}.${format}`;
        const outputPath = `converted/${outputName}`;

        await sharp(file.path).toFormat(format).toFile(outputPath);

        res.render("Convert/result", {
            previewUrl: "/" + file.path.replace(/\\/g, "/"),
            downloadUrl: "/" + outputPath.replace(/\\/g, "/"),
            bodyClass: "auth-page"
        });

    } catch (e) {
        req.flash("error", "Conversion failed");
        res.redirect("/convert");
    }
});

module.exports = router;
