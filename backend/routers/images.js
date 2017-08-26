// @flow

const { analyzeImageBuffer } = require('../services/images-service');
const router = require('express').Router();
const multer = require('multer');
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
            const result = await analyzeImageBuffer(req.file.buffer);
            return res.json(result);
        } catch (err) {
            if (err && err.status) {
                res.status(err.status);
            } else {
                res.status(500);
            }

            return res.send(err);
        }
    });

module.exports = router;