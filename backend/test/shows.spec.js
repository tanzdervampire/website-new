// @flow

process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const moment = require('moment');
const { KnownProduction, KnownPerson, KnownCast, prepareShow } = require('./test-util');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

const buildShowsUrl = (year, month, day, params) => {
    let url = `/api/shows/${year}/${month}`;
    if (day) {
        url += `/${day}`;
    }

    if (!params) {
        return url;
    }

    return `${url}?${buildParameters(params)}`;
};

const buildLatestShowsUrl = (before, params) => {
    const formattedBefore = before ? before.format('YYYY-MM-DD') : '';
    let url = `/api/shows/by-month/latest?before=${formattedBefore}`;
    if (!params) {
        return url;
    }

    url += '&' + buildParameters(params);
    return url;
};

const buildParameters = params => {
    let url = '';
    if (params.fields) {
        url += `fields=${params.fields.join(',')}&`;
    }

    if (params.location) {
        url += `location=${params.location}&`;
    }

    if (params.count) {
        url += `count=true&`;
    }

    return url;
};

const getShows = async (year, month, day, params) => {
    const res = await chai.request(server).get(buildShowsUrl(year, month, day, params));
    res.should.have.status(200);
    return res;
};

const getLatestShows = async (before, params) => {
    const res = await chai.request(server).get(buildLatestShowsUrl(before, params));
    res.should.have.status(200);
    return res;
};

chai.should();
chai.use(chaiHttp);

describe('/api/shows/:year/:month', () => {
    beforeEach(async () => {
        await mongoose.connection.dropDatabase();
    });

    it('returns all shows for a month', async () => {
        await Promise.all([
            await prepareShow({ date: moment('01.01.2017 19:30', 'DD.MM.YYYY HH:mm').toDate(), production: KnownProduction[0], cast: KnownCast.MAIN }),
            await prepareShow({ date: moment('01.02.2017 19:30', 'DD.MM.YYYY HH:mm').toDate(), production: KnownProduction[0], cast: KnownCast.MAIN }),
            await prepareShow({ date: moment('10.02.2017 14:30', 'DD.MM.YYYY HH:mm').toDate(), production: KnownProduction[0], cast: KnownCast.MAIN }),
            await prepareShow({ date: moment('10.02.2017 19:30', 'DD.MM.YYYY HH:mm').toDate(), production: KnownProduction[0], cast: KnownCast.MAIN }),
            await prepareShow({ date: moment('15.03.2017 19:30', 'DD.MM.YYYY HH:mm').toDate(), production: KnownProduction[0], cast: KnownCast.MAIN }),
        ]);

        const res = await getShows('2017', '02');
        res.body.length.should.be.eql(3);
    });

    it('can return the information about the production', async () => {
        await prepareShow({ date: moment('01.01.2017 19:30', 'DD.MM.YYYY HH:mm').toDate(), production: KnownProduction[0], cast: KnownCast.MAIN });

        const res = await getShows('2017', '01', null, { fields: ['production'] });
        res.body.length.should.be.eql(1);

        res.body[0].should.have.property('production');
        res.body[0].production.should.have.property('location').eql('Berlin');
        res.body[0].production.should.have.property('theater').eql('Theater des Westens');
        res.body[0].production.should.have.property('start');
        res.body[0].production.should.have.property('end');
    });

    it('can return the cast', async () => {
        await prepareShow({ date: moment('01.01.2017 19:30', 'DD.MM.YYYY HH:mm').toDate(), production: KnownProduction[0], cast: KnownCast.MAIN });

        const res = await getShows('2017', '01', null, { fields: ['cast'] });
        res.body.length.should.be.eql(1);

        res.body[0].should.have.property('cast');
        res.body[0].cast.length.should.be.eql(20);
    });

    it('can be restricted to a location', async () => {
        await Promise.all([
            await prepareShow({ date: moment('01.01.2017 19:30', 'DD.MM.YYYY HH:mm').toDate(), production: KnownProduction[0], cast: KnownCast.MAIN }),
            await prepareShow({ date: moment('02.01.2017 19:30', 'DD.MM.YYYY HH:mm').toDate(), production: KnownProduction[1], cast: KnownCast.MAIN }),
            await prepareShow({ date: moment('10.01.2017 19:30', 'DD.MM.YYYY HH:mm').toDate(), production: KnownProduction[0], cast: KnownCast.MAIN }),
        ]);

        const res = await getShows('2017', '01', null, { location: 'München' });
        res.body.length.should.be.eql(1);
    });

    it('can return only the number of matching shows', async () => {
        await Promise.all([
            await prepareShow({ date: moment('01.01.2017 19:30', 'DD.MM.YYYY HH:mm').toDate(), production: KnownProduction[0], cast: KnownCast.MAIN }),
            await prepareShow({ date: moment('02.01.2017 19:30', 'DD.MM.YYYY HH:mm').toDate(), production: KnownProduction[0], cast: KnownCast.MAIN }),
            await prepareShow({ date: moment('10.01.2017 19:30', 'DD.MM.YYYY HH:mm').toDate(), production: KnownProduction[0], cast: KnownCast.MAIN }),
        ]);

        const res = await getShows('2017', '01', null, { count: true });
        res.body.should.be.eql(3);
    });
});

describe('/api/shows/:year/:month/:day', () => {
    beforeEach(async () => {
        await mongoose.connection.dropDatabase();
    });

    it('returns all shows for a day', async () => {
        await Promise.all([
            await prepareShow({ date: moment('01.01.2017 14:30', 'DD.MM.YYYY HH:mm').toDate(), production: KnownProduction[0], cast: KnownCast.MAIN }),
            await prepareShow({ date: moment('01.01.2017 19:30', 'DD.MM.YYYY HH:mm').toDate(), production: KnownProduction[0], cast: KnownCast.MAIN }),
            await prepareShow({ date: moment('10.02.2017 14:30', 'DD.MM.YYYY HH:mm').toDate(), production: KnownProduction[0], cast: KnownCast.MAIN }),
        ]);

        const res = await getShows('2017', '01', '01');
        res.body.length.should.be.eql(2);
    });

    it('can return the information about the production', async () => {
        await prepareShow({ date: moment('01.01.2017 19:30', 'DD.MM.YYYY HH:mm').toDate(), production: KnownProduction[0], cast: KnownCast.MAIN });

        const res = await getShows('2017', '01', '01', { fields: ['production'] });
        res.body.length.should.be.eql(1);

        res.body[0].should.have.property('production');
        res.body[0].production.should.have.property('location').eql('Berlin');
        res.body[0].production.should.have.property('theater').eql('Theater des Westens');
        res.body[0].production.should.have.property('start');
        res.body[0].production.should.have.property('end');
    });

    it('can return the cast', async () => {
        await prepareShow({ date: moment('01.01.2017 19:30', 'DD.MM.YYYY HH:mm').toDate(), production: KnownProduction[0], cast: KnownCast.MAIN });

        const res = await getShows('2017', '01', '01', { fields: ['cast'] });
        res.body.length.should.be.eql(1);

        res.body[0].should.have.property('cast');
        res.body[0].cast.length.should.be.eql(20);
    });

    it('can be restricted to a location', async () => {
        await Promise.all([
            await prepareShow({ date: moment('01.01.2017 14:30', 'DD.MM.YYYY HH:mm').toDate(), production: KnownProduction[0], cast: KnownCast.MAIN }),
            await prepareShow({ date: moment('01.01.2017 19:30', 'DD.MM.YYYY HH:mm').toDate(), production: KnownProduction[0], cast: KnownCast.MAIN }),
            await prepareShow({ date: moment('01.01.2017 19:30', 'DD.MM.YYYY HH:mm').toDate(), production: KnownProduction[1], cast: KnownCast.MAIN }),
            await prepareShow({ date: moment('01.02.2017 19:30', 'DD.MM.YYYY HH:mm').toDate(), production: KnownProduction[1], cast: KnownCast.MAIN }),
        ]);

        const res = await getShows('2017', '01', '01', { location: 'München' });
        res.body.length.should.be.eql(1);
    });

    it('can return only the number of matching shows', async () => {
        await Promise.all([
            await prepareShow({ date: moment('01.01.2017 14:30', 'DD.MM.YYYY HH:mm').toDate(), production: KnownProduction[0], cast: KnownCast.MAIN }),
            await prepareShow({ date: moment('01.01.2017 19:30', 'DD.MM.YYYY HH:mm').toDate(), production: KnownProduction[0], cast: KnownCast.MAIN }),
            await prepareShow({ date: moment('01.02.2017 19:30', 'DD.MM.YYYY HH:mm').toDate(), production: KnownProduction[0], cast: KnownCast.MAIN }),
        ]);

        const res = await getShows('2017', '01', '01', { count: true });
        res.body.should.be.eql(2);
    });
});

describe('/api/shows/by-month/latest', () => {
    beforeEach(async () => {
        await mongoose.connection.dropDatabase();
    });

    it('can return the latest month', async () => {
        await Promise.all([
            await prepareShow({ date: moment().toDate(), production: KnownProduction[0], cast: KnownCast.MAIN }),
        ]);

        const res = await getLatestShows();
        res.body.length.should.be.eql(1);
    });

    it('can return the latest month before a given one', async () => {
        await Promise.all([
            await prepareShow({ date: moment('15.03.2017 19:30', 'DD.MM.YYYY HH:mm').toDate(), production: KnownProduction[0], cast: KnownCast.MAIN }),
            await prepareShow({ date: moment('01.01.2017 14:30', 'DD.MM.YYYY HH:mm').toDate(), production: KnownProduction[0], cast: KnownCast.MAIN }),
            await prepareShow({ date: moment('01.01.2017 19:30', 'DD.MM.YYYY HH:mm').toDate(), production: KnownProduction[0], cast: KnownCast.MAIN }),
        ]);

        const res = await getLatestShows(moment('15.03.2017 19:30', 'DD.MM.YYYY HH:mm'));
        res.body.length.should.be.eql(2);
    });
});