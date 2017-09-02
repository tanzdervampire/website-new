// @flow

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ProductionSchema = new Schema({
    location: {
        type: String,
        required: true,
    },
    theater: {
        type: String,
        required: true,
    },
    start: {
        type: Date,
        required: true,
    },
    end: Date,
});

module.exports = mongoose.model('Production', ProductionSchema, 'productions');