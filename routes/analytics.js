const express = require("express");
const sharp = require("sharp");
const multer = require("multer");
const router = express.Router();
const { mustLogin } = require("../Middleware/auth");

const upload = multer({ dest: "uploads/" });

router.get("/", mustLogin, (req, res) => {
    res.render("Analytics/index", {
        meta: null,
        imageUrl: null,
        bodyClass: "auth-page"
    });
});

router.post("/analyze", mustLogin, upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            req.flash("error", "Please upload an image");
            return res.redirect("/analytics");
        }

        const data = await sharp(req.file.path).metadata();

        const meta = {
            name: req.file.originalname,
            size: (req.file.size / 1024).toFixed(2) + " KB",
            format: data.format,
            width: data.width,
            height: data.height,
            megapixels: ((data.width * data.height) / 1_000_000).toFixed(2),
            aspectRatio: (data.width / data.height).toFixed(2),
            orientation: data.width > data.height ? "Landscape" : (data.width < data.height ? "Portrait" : "Square"),
            channels: data.channels,
            bitDepth: data.depth,
            hasAlpha: data.hasAlpha ? "Yes" : "No",
            colorSpace: data.space,
        };

        res.render("Analytics/index", {
            meta,
            imageUrl: `/uploads/${req.file.filename}`,
            bodyClass: "auth-page"
        });

    } catch (err) {
        req.flash("error", "Error analyzing image");
        res.redirect("/analytics");
    }
});

module.exports = router;
