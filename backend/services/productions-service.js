// @flow

const Production = require('../models/production');

const queryProductions = () => {
    return Production.find({})
        .lean()
        .sort({ start: 'ascending' });
};

module.exports = { queryProductions };