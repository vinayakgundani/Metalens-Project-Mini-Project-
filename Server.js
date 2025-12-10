const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const user = require("./Models/User");

const userouter = require("./routes/user");
const dashboardrote = require("./routes/dashboard");
const forgotPassword = require("./routes/forgotPassword");
const analyticsroute = require("./routes/analytics");
const convertRoute = require("./routes/convert");
const compressRoute = require("./routes/compress");



const sessionOptions = {
    secret: "mysecrete",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000
    }
};

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session(sessionOptions));
app.use(flash());
app.use(cookieParser());

app.set("view engine", "ejs");

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static("Public"));
app.use("/uploads", express.static("uploads"));
app.use("/converted", express.static("converted"));
app.use("/compressed", express.static("compressed"));  // ⭐IMPORTANT



app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

const ejsLayouts = require("express-ejs-layouts");
app.use(ejsLayouts);
app.set("layout", "layouts/boilerplate");

passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

const mongo_url = "mongodb://127.0.0.1:27017/Agro-Kami";

main()
    .then(() => console.log("Connected to MongoDb"))
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect(mongo_url);
}

app.use("/forgotpass", forgotPassword);
app.use("/dashboard", dashboardrote);
app.use("/analytics", analyticsroute);
app.use("/convert", convertRoute);
app.use("/compress", compressRoute);
app.use("/", userouter);

app.listen(8089, () => {
    console.log("Server listening on port 8089");
});
