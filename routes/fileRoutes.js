const router = require('express').Router()
const upload = require("../utils/upload")
const {StatusError} = require('../utils/index')

router.post("/upload", upload.single('file'), (req, res)=>{
    if(!req.file) throw StatusError("Required file not found",400)
    res.status(200).send(req.file.location)
})

router.post("/upload/multi", upload.array('files'), (req, res)=>{
    if(!req.files.length) throw StatusError("Required files not found",400)
    res.status(200).send(req.files)
})

module.exports = router