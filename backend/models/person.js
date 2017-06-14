// @flow

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var PersonSchema = new Schema({
    name: String,
});

module.exports = mongoose.model('Person', PersonSchema);