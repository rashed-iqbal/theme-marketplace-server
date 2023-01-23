const aws = require("aws-sdk");
const { default: axios } = require("axios");
const { StatusError } = require("../utils");

const BUCKET = process.env.BUCKET_NAME;
const s3 = new aws.S3();

// upload file
async function uploadOnBucket(req, res) {
    try {
        if (!req.file) return res.status(404).send("File is required");
        res.status(200).send(req.file);
    } catch (err) {
        res.status(500).send("Internal Server Error");
    }
}

// list of uploaded file
async function getFile(req, res) {
    let r = await s3.listObjectsV2({ Bucket: BUCKET }).promise();
    let x = r.Contents.map((item) => item.Key);
    res.send(x);
}

// download file
async function downloadFile(req, res) {
    const filename = req.params.filename;
    let x = await s3.getObject({ Bucket: BUCKET, Key: filename }).promise();
    res.send(x.Body);
}

// delete file
async function deleteFunction(req, res) {
    try {
        const filename = req.params.filename;
        if (!filename) return res.status(404).send("File name is required");
        await s3.deleteObject({ Bucket: BUCKET, Key: filename }).promise();
        res.send("File Deleted Successfully");
    } catch (err) {
        res.status(500).send("Internal Server Error");
    }
}

const getFileSize = async (req, res) => {
    const { url } = req.body;
    try {
        if (!url) throw StatusError("Required url not found", 400);

        const response = await axios.head(url);
        const size = response.headers.getContentLength();
        res.status(200).send(size);
    } catch (err) {
        const errMessage = err.response
            ? err.response.data.message
            : err.message;
        res.status(err.status || 500).send({ message: errMessage });
    }
};

module.exports = {
    uploadOnBucket,
    getFile,
    downloadFile,
    deleteFunction,
    getFileSize,
};
