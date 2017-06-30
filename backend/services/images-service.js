// @flow

const { analyzeImage } = require('./ocr');
const streamifier = require('streamifier');

const analyzeImageBuffer = buffer => {
    const stream = streamifier.createReadStream(req.file.buffer);
    return analyzeImage(stream);
};

module.exports = { analyzeImageBuffer };