const express = require("express");
const router = express.Router();
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

// Upload folder
const upload = multer({ dest: "uploads/" });

// Ensure converted folder exists
if (!fs.existsSync("converted")) {
    fs.mkdirSync("converted");
}

// GET Converter Form Page
router.get("/", (req, res) => {
    res.render("Convert/index", {
        bodyClass: "auth-page"
    });
});

// POST — Convert Image & Redirect to Result Page
router.post("/process", upload.single("image"), async (req, res) => {
    try {
        const file = req.file;
        const format = req.body.format;

        if (!file) {
            req.flash("error", "Please upload an image");
            return res.redirect("/convert");
        }

        const inputPath = file.path;
        const name = path.parse(file.originalname).name;
        const outputName = `${Date.now()}-${name}.${format}`;
        const outputPath = path.join("converted", outputName);

        // Convert image
        await sharp(inputPath)
            .toFormat(format)
            .toFile(outputPath);

        // Render Clean Result Page
        res.render("Convert/result", {
            previewUrl: "/" + inputPath.replace(/\\/g, "/"),
            downloadUrl: "/" + outputPath.replace(/\\/g, "/"),
            bodyClass: "auth-page"
        });

    } catch (err) {
        console.log(err);
        req.flash("error", "Conversion failed");
        return res.redirect("/convert");
    }
});

module.exports = router;
