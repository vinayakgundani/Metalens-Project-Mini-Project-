const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const { mustLogin } = require("../Middleware/auth");

const upload = multer({ dest: "uploads/" });

if (!fs.existsSync("compressed")) fs.mkdirSync("compressed");

router.get("/", mustLogin, (req, res) => {
    res.render("Compress/index", {
        fileUploaded: false,
        uploadedPath: null,
        originalSizeKB: null,
        bodyClass: "auth-page"
    });
});

router.post("/upload", mustLogin, upload.single("image"), (req, res) => {
    const sizeKB = (fs.statSync(req.file.path).size / 1024).toFixed(2);

    res.render("Compress/index", {
        fileUploaded: true,
        uploadedPath: req.file.path,
        originalSizeKB: sizeKB,
        bodyClass: "auth-page"
    });
});

router.post("/process", mustLogin, async (req, res) => {
    try {
        const { uploadedPath, targetSize } = req.body;

        const outputName = `compressed-${Date.now()}.jpg`;
        const outputPath = `compressed/${outputName}`;

        let quality = Math.max(5, Math.min(100, (targetSize / 500) * 100));

        await sharp(uploadedPath).jpeg({ quality }).toFile(outputPath);

        const originalKB = (fs.statSync(uploadedPath).size / 1024).toFixed(2);
        const compressedKB = (fs.statSync(outputPath).size / 1024).toFixed(2);

        res.render("Compress/result", {
            previewUrl: "/" + uploadedPath.replace(/\\/g, "/"),
            compressedUrl: "/" + outputPath.replace(/\\/g, "/"),
            originalSizeKB: originalKB,
            compressedSizeKB: compressedKB,
            bodyClass: "auth-page"
        });

    } catch (err) {
        req.flash("error", "Compression failed");
        res.redirect("/compress");
    }
});

module.exports = router;
