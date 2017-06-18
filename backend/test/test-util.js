// @flow

const moment = require('moment');
const Production = require('../models/production');
const Person = require('../models/person');

const sampleProductions = [
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

const samplePersons = [
    { name: 'Thomas Borchert' },
    { name: 'Veronica Appeddu' },
    { name: 'Tom van der Ven' },
    { name: 'Victor Petersen' },
    { name: 'Nicolas Tenerani' },
    { name: 'Merel Zeeman' },
    { name: 'Max Meister' },
    { name: 'Yvonne Köstler' },
    { name: 'Paolo Bianca' },
    { name: 'Kevin Schmid' },
    { name: 'Csaba Nagy' },
    { name: 'Alessandra Bizarri' },
    { name: 'Kirill Zolygin' },
    { name: 'Michael Anzalone' },
    { name: 'Máté Gyenei' },
    { name: 'Joe Nolan' },
    { name: 'Gonzalo Campos' },
    { name: 'Kevin Hudson' },
    { name: 'Anja Wendzel' },
    { name: 'Leif Klinkhardt' },
];

const prepareProductions = async opts => {
    const numberOfProductions = opts.numberOfProductions || sampleProductions.length;
    const productions = sampleProductions.slice(0, numberOfProductions);

    const promises = productions.map(production => new Production(production).save());
    return Promise.all(promises);
};

const preparePerson = name => {
    const person = typeof name === 'string' ? { name } : name;
    return new Person(person).save();
};

const preparePersons = async opts => {
    const numberOfPersons = opts.numberOfPersons || samplePersons.length;
    const persons = samplePersons.slice(0, numberOfPersons);

    const promises = persons.map(preparePerson);
    return Promise.all(promises);
};

module.exports = { prepareProductions, preparePerson, preparePersons };