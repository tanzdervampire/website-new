/**
 * Migrates JSON files to a local mongodb.
 * Expects the full path to the database as an argument.
 *
 * After running, the database can be dumped using mongodump.
 */

const fs = require('fs');
const moment = require('moment');
const mongodb = require('mongodb');

const path = process.argv[2];
if (!path) {
    console.log('No path given.');
    process.exit(1);
}

const slurp = fn => {
    return fs.readFileSync(fn, {
        encoding: 'utf8'
    });
};

const slurpJson = fn => {
    return JSON.parse(slurp(fn));
};

const flattenCast = async (db, cast) => {
    let result = [];
    await Promise.all(Object.keys(cast).map(async role => {
        const entries = await Promise.all(cast[role].map(async name => {
            const entry = await db.collection('persons').findOne({ name });
            if (!entry) {
                console.error(`Could not find person "${name}"`);
                throw {};
            }

            return {
                role: role,
                person: entry._id,
            };
        }));

        result = [...result, ...entries];
    }));

    return result;
};

const migrateProductions = db => {
    const data = slurpJson(`${path}/productions.json`);
    return db.collection('productions').insertMany(data.map(production => {
        return {
            location: production.location,
            theater: production.theater,
            start: moment(production.start, 'YYYY-MM-DD').startOf('day').toDate(),
            end: moment(production.end, 'YYYY-MM-DD').endOf('day').toDate(),
        };
    }));
};

const migratePersons = db => {
    return slurpJson(`${path}/names.json`).map(async name => await db.collection('persons').insertOne({ name }));
};

const migrateShows = db => {
    const fnToDate = fn => moment(fn.replace(/\.json$/, ''), 'DD.MM.YYYY-HHmm');
    return fs.readdirSync(`${path}/data/`)
        .map(location => fs.readdirSync(`${path}/data/${location}/`).map(fn => { return { 'fn': fn, 'location': location }; }))
        .reduce((a,b) => [...a, ...b])
        .sort((a,b) => fnToDate(a.fn).diff(fnToDate(b.fn)))
        .map(async show => {
            const data = slurpJson(`${path}/data/${show.location}/${show.fn}`);
            const date = moment(`${data.day} ${data.time}`, 'DD.MM.YYYY HH:mm');

            const entry = await db.collection('productions').findOne({
                location: data.location,
                theater: data.theater,
                start: { $lt: date.clone().add(3, 'day').toDate() },
                end: { $gt: date.clone().subtract(1, 'day').toDate() },
            });
            if (!entry) {
                console.error(`Could not find production for ${JSON.stringify(data, null, 4)}`);
                throw {};
            }

            console.log(`Inserting show for ${date.format('DD.MM.YYYY HH:mm')}`);
            return await db.collection('shows').insertOne({
                date: date.toDate(),
                production: entry._id,
                cast: await flattenCast(db, data.cast),
            });
        });
};

(async () => {
    const db = await mongodb.MongoClient.connect('mongodb://localhost/tdv');
    await db.dropDatabase();

    console.log('Migrating productions…');
    await migrateProductions(db);

    console.log('Migrating persons…');
    await Promise.all(migratePersons(db));

    console.log('Migrating shows…');
    await Promise.all(migrateShows(db));

    db.close();
})();