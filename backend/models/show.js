// @flow

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ShowSchema = new Schema({
    date: Date,
    production: {
        type: Schema.Types.ObjectId,
        ref: 'Production',
    },
    cast: [{
        role: String,
        person: {
            type: Schema.Types.ObjectId,
            ref: 'Person',
        },
    }],
});

module.exports = mongoose.model('Show', ShowSchema, 'shows');