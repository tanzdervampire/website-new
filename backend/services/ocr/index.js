// @flow

const { callCognitiveServicesOcr, convertCognitiveServicesResponse, extractCast } = require('./ocr');

const analyzeImage = async stream => {
    // TODO FIXME process.env.COGNITIVE_SERVICES_API_KEY
    const [ response, mapping ] = await Promise.all([
        callCognitiveServicesOcr(stream, '<RETRACTED>'),
        /* TODO FIXME */
        {},
    ]);

    // TODO FIXME
    return response;
};

module.exports = {
    analyzeImage,
    convertCognitiveServicesResponse,
    extractCast
};