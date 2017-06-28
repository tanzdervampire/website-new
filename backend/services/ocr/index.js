// @flow

const { callCognitiveServicesOcr, convertCognitiveServicesResponse, extractCast } = require('./ocr');
const { queryRoles } = require('../roles-service');

const analyzeImage = async stream => {
    // TODO FIXME process.env.COGNITIVE_SERVICES_API_KEY
    const [ response, mapping ] = await Promise.all([
        callCognitiveServicesOcr(stream, '<RETRACTED>'),
        queryRoles({}),
    ]);

    try {
        const data = convertCognitiveServicesResponse(response);
        return extractCast(data, mapping);
    } catch (err) {
        console.error(err);
        return null;
    }
};

module.exports = {
    analyzeImage,
    convertCognitiveServicesResponse,
    extractCast
};