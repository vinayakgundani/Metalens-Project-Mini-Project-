const express = require("express");
const router = express.Router();
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const upload = multer({ dest: "uploads/" });

// Ensure /compressed folder exists
if (!fs.existsSync("compressed")) {
    fs.mkdirSync("compressed");
}

// STEP 1 → Load Main Compressor Page
router.get("/", (req, res) => {
    res.render("Compress/index", {
        fileUploaded: false,
        uploadedPath: null,
        originalSizeKB: null,
        bodyClass: "auth-page"
    });
});

// STEP 2 → Upload Image & Show Slider
router.post("/upload", upload.single("image"), (req, res) => {
    if (!req.file) {
        req.flash("error", "Upload a valid image");
        return res.redirect("/compress");
    }

    const filePath = req.file.path;
    const stats = fs.statSync(filePath);
    const originalSizeKB = (stats.size / 1024).toFixed(2);

    res.render("Compress/index", {
        fileUploaded: true,
        uploadedPath: filePath,
        originalSizeKB,
        bodyClass: "auth-page"
    });
});

// STEP 3 → Compress & Show Result Page
router.post("/process", async (req, res) => {
    try {
        const { uploadedPath, targetSize } = req.body;

        if (!uploadedPath) {
            req.flash("error", "No file found");
            return res.redirect("/compress");
        }

        const filename = `compressed-${Date.now()}.jpg`;
        const outputPath = `compressed/${filename}`;

        // Adjust compression quality (roughly scales size)
        let quality = Math.max(5, Math.min(100, Math.floor((targetSize / 500) * 100)));

        await sharp(uploadedPath)
            .jpeg({ quality })
            .toFile(outputPath);

        const originalStats = fs.statSync(uploadedPath);
        const compressedStats = fs.statSync(outputPath);

        res.render("Compress/result", {
            previewUrl: "/" + uploadedPath.replace(/\\/g, "/"),
            compressedUrl: "/" + outputPath.replace(/\\/g, "/"),
            originalSizeKB: (originalStats.size / 1024).toFixed(2),
            compressedSizeKB: (compressedStats.size / 1024).toFixed(2),
            bodyClass: "auth-page"
        });

    } catch (err) {
        console.log(err);
        req.flash("error", "Compression failed");
        res.redirect("/compress");
    }
});

module.exports = router;
