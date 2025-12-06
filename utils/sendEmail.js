const nodemailer = require("nodemailer");

module.exports = async(to, subject, message) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "vinayakgundani18@gmail.com",
            pass: "sdzpdbhttktgcmbi"
        }
    });

    await transporter.sendMail({
        from: "yourgmail@gmail.com",
        to,
        subject,
        text: message
    });
};