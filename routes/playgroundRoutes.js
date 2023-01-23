const email = require("../utils/email");
const AES = require("crypto-js/aes");
const CryptoJS = require("crypto-js");

const SALT = "6d090796-ecdf-11ea-adc1-0242ac112345";

const router = require("express").Router();

router.post("/send-email", async (req, res) => {
    // Send contact us mail
    await email.send({
        message: {
            to: "rashediq6al@gmail.com",
        },
        template: "contact_us",
        locals: {
            subject: "Theme error massage",
            department: "Buying and items support",
            description:
                "Established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum.",
            customer: {
                name: "Rashed Iqbal",
                email: "rashediqbal@gmail.com",
                type: "Active",
            },
        },
    });

    // Send Reset Password Mail
    await email.send({
        message: {
            to: "rashediq6al@gmail.com",
        },
        template: "reset_password",
        locals: {
            name: "Rashed Iqbal",
            url: "https://theme-marketplace.vercel.app/",
        },
    });

    // send Confirm Email mail
    await email.send({
        message: {
            to: "rashediq6al@gmail.com",
        },
        template: "confirm_email",
        locals: {
            name: "Rashed Iqbal",
            url: "https://theme-marketplace.vercel.app/",
        },
    });

    res.status(200).send("Email sent successfully");
});

router.post("/encrypt", async (req, res) => {
    const hash = AES.encrypt(JSON.stringify(req.body), SALT).toString();

    res.status(200).send(hash);
});

router.post("/decrypt", async (req, res) => {
    const { hash } = req.body;
    const data = AES.decrypt(hash, SALT).toString(CryptoJS.enc.Utf8);

    res.status(200).send(data);
});

module.exports = router;
