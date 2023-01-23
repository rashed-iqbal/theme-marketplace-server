const Email = require("email-templates");
const path = require("path");

module.exports = new Email({
    message: {
        from: process.env.USER,
    },
    transport: {
        host: process.env.HOST,
        service: process.env.SERVICE,
        port: Number(process.env.EMAIL_PORT),
        secure: Boolean(process.env.SECURE),
        auth: {
            user: process.env.USER,
            pass: process.env.PASS,
        },
    },
    preview: false,
    views: {
        locals: {
            IMG_URL: "https://theme-marketplace.vercel.app/email",
            EMAIL: "themesmarket@example.com",
            INSTAGRAM_URL: "https://www.instagram.com/",
            TWITTER_URL: "https://twitter.com/",
            YOUTUBE_URL: "https://www.youtube.com/",
            TERMS_URL: "https://theme-marketplace.vercel.app/terms-condition",
            PRIVACY_URL: "https://theme-marketplace.vercel.app/privacy-policy",
            ADDRESS: "5781 Spring St Salinas, NY 88606 United States",
        },
        root: path.join(__dirname, "../", "views", "emails"),
        options: {
            extension: "ejs",
        },
    },
    juice: true,
    send: true,
});
