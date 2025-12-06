const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.get("/", (req, res) => {
    res.render("Analytics/index", { meta: null, imageUrl: null, bodyClass: "auth-page" });
});

router.post("/analyze", upload.single("image"), async(req, res) => {
    try {
        const file = req.file;

        if (!file) {
            req.flash("error", "Please upload an image");
            return res.redirect("/analytics");
        }

        const data = await sharp(file.path).metadata();

        const metadata = {
            name: file.originalname,
            size: (file.size / 1024).toFixed(2) + " KB",
            format: data.format,
            width: data.width,
            height: data.height,

            megapixels: ((data.width * data.height) / 1000000).toFixed(2) + " MP",
            aspectRatio: (data.width / data.height).toFixed(2),
            orientation: data.width === data.height ?
                "Square" :
                data.width > data.height ?
                "Landscape" :
                "Portrait",

            // guaranteed values
            channels: data.channels,
            bitDepth: data.depth,
            hasAlpha: data.hasAlpha ? "Yes" : "No",
            colorSpace: data.space || "Unknown",
            density: data.density || "Not Available" // DPI
        };

        res.render("Analytics/index", {
            meta: metadata,
            imageUrl: `/uploads/${file.filename}`,
            bodyClass: "auth-page"
        });

    } catch (err) {
        console.log(err);
        req.flash("error", "Error analyzing image");
        res.redirect("/analytics");
    }
});

module.exports = router;