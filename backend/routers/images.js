// @flow

const { analyzeImage } = require('../services/ocr');
const router = require('express').Router();
const multer = require('multer');
const streamifier = require('streamifier');
const fileType = require('file-type');
const path = require('path');

// TODO FIXME Replace with diskStorage and use req.file.path; ditch streamifier.
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        fileSize: 4 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|bmp/;
        if (!allowedTypes.test(file.mimetype)) {
            return cb(new Error('Invalid file format!'));
        }

        if (!allowedTypes.test(path.extname(file.originalname).toLowerCase())) {
            return cb(new Error('Invalid file extension!'));
        }

        return cb(null, true);
    },
});

router.route('/analysis')
    .post(upload.single('image'), async (req, res) => {
        try {
            const stream = streamifier.createReadStream(req.file.buffer);
            const result = await analyzeImage(stream);
            return res.json(result);
        } catch (err) {
            return res.send(err);
        }
    });

module.exports = router;