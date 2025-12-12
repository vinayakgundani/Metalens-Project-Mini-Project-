const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const user = require("./Models/User");

const { mustLogin, mustLogout } = require("./Middleware/auth");

const userouter = require("./routes/user");
const dashboardRoute = require("./routes/dashboard");
const forgotPassword = require("./routes/forgotPassword");
const analyticsRoute = require("./routes/analytics");
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
app.use("/compressed", express.static("compressed"));

// Make user available to EJS globally
app.use((req, res, next) => {
    res.locals.currentUser = req.user || null;
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

async function main() {
    await mongoose.connect(mongo_url);
}
main().then(() => console.log("Connected to MongoDb"))
.catch(err => console.log(err));

// ROUTES
app.use("/", userouter);
app.use("/forgotpass", forgotPassword);
app.use("/dashboard", mustLogin, dashboardRoute);
app.use("/analytics", mustLogin, analyticsRoute);
app.use("/convert", mustLogin, convertRoute);
app.use("/compress", mustLogin, compressRoute);

app.listen(8089, () => console.log("Server running on 8089"));
