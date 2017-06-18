// @flow

const moment = require('moment');
const Production = require('../models/production');
const Person = require('../models/person');
const Show = require('../models/show');

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

const KnownPerson = (() => {
    let result = {};
    samplePersons.forEach(person => result[person.name] = person);
    return result;
})();

const sampleCasts = (() => {
    const makeCast = cast => {
        const roles = [ 'Graf von Krolock', 'Sarah', 'Alfred', 'Professor Abronsius', 'Chagal', 'Magda', 'Herbert', 'Rebecca', 'Koukol', 'Tanzsolisten', 'Gesangssolisten', 'Tanzensemble', 'Gesangsensemble', 'Dirigent' ];
        let i = 0;

        let result = [];
        cast.forEach(entry => {
            const entries = (Object.prototype.toString.call(entry) === '[object Array]') ? entry : [ entry ];
            entries.forEach(e => result.push({ role: roles[ i ], person: e }));
            i++;
        });

        return result;
    };

    const _ = KnownPerson;
    return {
        MAIN: makeCast([
            _[ 'Thomas Borchert' ],
            _[ 'Veronica Appeddu' ],
            _[ 'Tom van der Ven' ],
            _[ 'Victor Petersen' ],
            _[ 'Nicolas Tenerani' ],
            _[ 'Merel Zeeman' ],
            _[ 'Max Meister' ],
            _[ 'Yvonne Köstler' ],
            _[ 'Paolo Bianca' ],
            [ _[ 'Kevin Schmid' ], _[ 'Csaba Nagy' ], _[ 'Alessandra Bizarri' ] ],
            [ _[ 'Kirill Zolygin' ], _[ 'Michael Anzalone' ] ],
            [ _[ 'Máté Gyenei' ], _[ 'Joe Nolan' ] ],
            [ _[ 'Gonzalo Campos' ], _[ 'Kevin Hudson' ], _[ 'Anja Wendzel' ] ],
            _[ 'Leif Klinkhardt' ],
        ]),
    };
})();

const prepareProduction = production => {
    return Production.findOneAndUpdate({
        location: production.location,
        start: production.start,
        end: production.end,
    }, production, { upsert: true, new: true });
};

const prepareProductions = async opts => {
    const numberOfProductions = opts.numberOfProductions || sampleProductions.length;
    const productions = sampleProductions.slice(0, numberOfProductions);

    const promises = productions.map(prepareProduction);

    return Promise.all(promises);
};

const preparePerson = name => {
    const person = typeof name === 'string' ? { name } : name;
    return Person.findOneAndUpdate({ name: person.name }, person, { upsert: true, new: true });
};

const preparePersons = async opts => {
    const numberOfPersons = opts.numberOfPersons || samplePersons.length;
    const persons = samplePersons.slice(0, numberOfPersons);

    const promises = persons.map(preparePerson);
    return Promise.all(promises);
};

const prepareShow = async opts => {
    let production = opts.production;
    if (typeof production === 'object') {
        production = (await prepareProduction(production))._id;
    }

    let cast = [];
    await Promise.all(opts.cast.map(async entry => {
        if (typeof entry.person === 'object') {
            cast.push({ role: entry.role, person: (await preparePerson(entry.person))._id });
        } else {
            cast.push({ role: entry.role, person: entry.person });
        }

        return Promise.resolve();
    }));

    return new Show({ date: opts.date, production, cast }).save();
};

const mergeCasts = (first, second) => {
    return [...first.filter(entry => {
        return !second.some(e => e.role === entry.role);
    }), ...second];
};

module.exports = {
    KnownProduction: sampleProductions,
    KnownPerson,
    KnownCast: sampleCasts,
    prepareProduction,
    prepareProductions,
    preparePerson,
    preparePersons,
    prepareShow,
    mergeCasts
};