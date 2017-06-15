// @flow

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ProductionSchema = new Schema({
    location: String,
    theater: String,
    start: Date,
    end: Date,
});

module.exports = mongoose.model('Production', ProductionSchema, 'productions');