// @flow

require('dotenv').config();

const { callCognitiveServicesOcr, convertCognitiveServicesResponse, extractCast } = require('./ocr');
const { queryRoles } = require('../roles-service');

const analyzeImage = async stream => {
    const [ response, mapping ] = await Promise.all([
        callCognitiveServicesOcr(stream, process.env.COGNITIVE_SERVICES_API_KEY),
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