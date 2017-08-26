// @flow

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ShowSchema = new Schema({
    date: {
        type: Date,
        required: true,
    },
    production: {
        type: Schema.Types.ObjectId,
        ref: 'Production',
        required: true,
    },
    cast: {
        type: [{
            role: {
                type: String,
                required: true,
                enum: ['Graf von Krolock', 'Sarah', 'Alfred', 'Professor Abronsius', 'Chagal', 'Magda', 'Herbert', 'Rebecca', 'Koukol', 'Tanzsolisten', 'Gesangssolisten', 'Tanzensemble', 'Gesangsensemble', 'Dirigent'],
            },
            person: {
                type: Schema.Types.ObjectId,
                ref: 'Person',
                required: true,
            },
        }],
        required: true,
    }
});

module.exports = mongoose.model('Show', ShowSchema, 'shows');