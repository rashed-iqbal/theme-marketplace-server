const router = require("express").Router();
const BillingHistory = require("../models/BillingHistory");
const pdf = require("html-pdf");
const archiver = require("archiver");
const BillingTemplate = require("../templates/index");
const {
    getBilling,
    createBilling,
    getUserBilling,
} = require("../controllers/billingController");

router.get("/", getBilling).post("/", createBilling);

router.get("/user/:userId", getUserBilling);

router.get("/download/:id", async (req, res) => {
    const { id } = req.params;
    try {
        if (!id) throw StatusError("Required id not found", 400);
        const billing = await BillingHistory.findOne({ _id: id })
            .populate("userId")
            .populate("plan")
            .exec();

        const htmlText = BillingTemplate({
            plan_price: billing.plan.planPrice,
            invoice_no: billing.invoice_no,
            user_name: billing.userId.firstName,
            createdAt: billing.createdAt,
            plan_name: billing.plan.planName,
            // address: billing.address,
        });

        const fileName = `billing-report-#${billing._id}.pdf`;
        pdf.create(htmlText).toStream((err, stream) => {
            if (err) return res.status(400).send("Something went wrong");
            res.set({
                "Content-Disposition": fileName,
                "Content-Type": "application/pdf",
            });
            stream.pipe(res);
        });
    } catch (err) {
        res.status(err.status || 500).send(err.message);
    }
});

router.get("/download/all/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
        if (!userId) throw StatusError("Required userId not found!", 400);

        const billingRecords = await BillingHistory.find({ userId })
            .populate("userId")
            .populate("plan")
            .exec();

        const billingMap = await async.map(billingRecords, (data, callback) => {
            const billing = data._doc;
            const htmlText = BillingTemplate({
                plan_price: billing.plan.planPrice,
                invoice_no: billing._id,
                user_name: billing.userId.firstName,
                createdAt: billing.createdAt,
                plan_name: billing.plan.planName,
                // address: billing.address,
            });
            const fileName = `billing-report-#${billing._id}.pdf`;
            pdf.create(htmlText).toBuffer((err, buffer) => {
                if (err) return callback(err);
                callback(null, { fileName, buffer });
            });
        });

        const archive = archiver("zip");
        const fileName = `billing-${userId}.zip`;

        res.set({
            "Content-Disposition": fileName,
            "Content-Type": "application/pdf",
        });
        archive.pipe(res);

        billingMap.forEach((data) => {
            archive.append(Buffer.from(data.buffer), {
                name: data.fileName,
            });
        });
        archive.on("error", (err) => {
            throw err;
        });
        archive.finalize();
    } catch (err) {
        res.status(err.status || 500).send({ message: err.message });
    }
});

module.exports = router;
