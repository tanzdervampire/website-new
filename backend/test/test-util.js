// @flow

const moment = require('moment');
const Production = require('../models/production');

const allProductions = [
    {
        location: 'Berlin',
        theater: 'Theater des Westens',
        start: moment.utc('2016-04-24', 'YYYY-MM-DD').startOf('day').toDate(),
        end: moment.utc('2016-09-25', 'YYYY-MM-DD').endOf('day').toDate(),
    },
    {
        location: 'München',
        theater: 'Deutsches Theater München',
        start: moment.utc('2016-10-05', 'YYYY-MM-DD').startOf('day').toDate(),
        end: moment.utc('2017-01-15', 'YYYY-MM-DD').endOf('day').toDate(),
    },
    {
        location: 'Stuttgart',
        theater: 'Palladium-Theater',
        start: moment.utc('2017-01-26', 'YYYY-MM-DD').startOf('day').toDate(),
        end: moment.utc('2017-09-03', 'YYYY-MM-DD').endOf('day').toDate(),
    }
];

const prepareProductions = async opts => {
    const numberOfProductions = opts.numberOfProductions || allProductions.length;
    const productions = allProductions.slice(0, numberOfProductions);

    const promises = productions.map(production => {
        return new Production(production).save();
    });

    return Promise.all(promises);
};

module.exports = { prepareProductions };