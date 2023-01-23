const router = require("express").Router();
const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const {
    uploadOnBucket,
    getFile,
    downloadFile,
    deleteFunction,
    getFileSize,
} = require("../controllers/bucketController");

// config

aws.config.update({
    secretAccessKey: process.env.BUCKET_ACCESS_SECRET_KEY,
    accessKeyId: process.env.BUCKET_ACCESS_KEY,
    region: process.env.BUCKET_REGION,
});
const BUCKET = process.env.BUCKET_NAME;
const s3 = new aws.S3();

const upload = multer({
    storage: multerS3({
        s3: s3,
        acl: "public-read",
        bucket: BUCKET,
        key: function (req, file, cb) {
            cb(null, Date.now() + file.originalname);
        },
    }),
});

router.post("/upload", upload.single("file"), uploadOnBucket);

router.get("/list", getFile);

router.get("/download/:filename", downloadFile);

router.delete("/remove/:filename", deleteFunction);

router.post("/file/size", getFileSize);

module.exports = router;
