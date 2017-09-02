// @flow

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var PersonSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Person', PersonSchema, 'persons');