// @flow

const { analyzeImage } = require('./ocr');
const streamifier = require('streamifier');

const analyzeImageBuffer = buffer => {
    const stream = streamifier.createReadStream(buffer);
    return analyzeImage(stream);
};

module.exports = { analyzeImageBuffer };