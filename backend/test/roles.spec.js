// @flow

process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const moment = require('moment');
const { KnownProduction, KnownPerson, KnownCast, prepareShow } = require('./test-util');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

const getRoles = async (...params) => {
    const res = await chai.request(server).get(`/api/roles?${params.join('&')}`);
    res.should.have.status(200);
    res.body.should.be.a('array');
    return res;
};

const byRole = (body, role) => body.filter(p => p.role === role)[0];

chai.should();
chai.use(chaiHttp);

describe('/api/roles', () => {
    beforeEach(async () => {
        await mongoose.connection.dropDatabase();
    });

    it('works', async () => {
        const res = await getRoles();
        res.body.length.should.be.eql(0);
    });

    it('returns a single person', async () => {
        await prepareShow({ date: moment('01.01.2017 19:30', 'DD.MM.YYYY HH:mm').toDate(), production: KnownProduction[0], cast: KnownCast.MAIN });

        const res = await getRoles();
        res.body.length.should.be.eql(14);

        const krolock = byRole(res.body, 'Graf von Krolock');
        krolock.should.have.property('persons');
        krolock.persons.should.be.a('array').that.has.length(1);
        krolock.persons[0].should.have.property('name').eql('Thomas Borchert');
        krolock.persons[0].should.have.property('numberOfShows').eql(1);
    });

    it('returns the correct number of shows when playing the same role', async () => {
        await prepareShow({ date: moment('01.01.2017 14:30', 'DD.MM.YYYY HH:mm').toDate(), production: KnownProduction[0], cast: KnownCast.MAIN });
        await prepareShow({ date: moment('01.01.2017 19:30', 'DD.MM.YYYY HH:mm').toDate(), production: KnownProduction[0], cast: KnownCast.MAIN });

        const res = await getRoles();
        byRole(res.body, 'Graf von Krolock').persons[0].numberOfShows.should.eql(2);
    });

    it('returns the correct number of shows when playing different roles', async () => {
        await prepareShow({ date: moment('01.01.2017 14:30', 'DD.MM.YYYY HH:mm').toDate(), production: KnownProduction[0],
            cast: [ { role: 'Graf von Krolock', person: KnownPerson['Kirill Zolygin'] } ] });
        await prepareShow({ date: moment('01.01.2017 19:30', 'DD.MM.YYYY HH:mm').toDate(), production: KnownProduction[0],
            cast: [ { role: 'Chagal', person: KnownPerson['Kirill Zolygin'] } ] });

        const res = await getRoles();
        res.body.length.should.be.eql(2);
        byRole(res.body, 'Graf von Krolock').persons[0].numberOfShows.should.eql(1);
        byRole(res.body, 'Chagal').persons[0].numberOfShows.should.eql(1);
    });

    it('counts multiple roles in one show exactly once each', async () => {
        await prepareShow({ date: moment('01.01.2017 14:30', 'DD.MM.YYYY HH:mm').toDate(), production: KnownProduction[0],
            cast: [
                { role: 'Graf von Krolock', person: KnownPerson['Kirill Zolygin'] },
                { role: 'Gesangssolisten', person: KnownPerson['Kirill Zolygin'] },
            ]
        });

        const res = await getRoles();
        res.body.length.should.be.eql(2);
        byRole(res.body, 'Graf von Krolock').persons[0].numberOfShows.should.eql(1);
        byRole(res.body, 'Gesangssolisten').persons[0].numberOfShows.should.eql(1);
    });

    it('can be restricted to a single role', async () => {
        await prepareShow({ date: moment('01.01.2017 19:30', 'DD.MM.YYYY HH:mm').toDate(), production: KnownProduction[0], cast: KnownCast.MAIN });

        const res = await getRoles('roles=Alfred');
        res.body.length.should.be.eql(1);
    });

    it('can be restricted to a list of roles', async () => {
        await prepareShow({ date: moment('01.01.2017 19:30', 'DD.MM.YYYY HH:mm').toDate(), production: KnownProduction[0], cast: KnownCast.MAIN });

        const res = await getRoles('roles=Alfred,Graf+von+Krolock,Professor+Abronsius');
        res.body.length.should.be.eql(3);
    });

    it('can be restricted to a location', async () => {
        await prepareShow({ date: moment('01.01.2016 19:30', 'DD.MM.YYYY HH:mm').toDate(), production: KnownProduction[0], cast: KnownCast.MAIN });
        await prepareShow({ date: moment('01.01.2017 19:30', 'DD.MM.YYYY HH:mm').toDate(), production: KnownProduction[1], cast: KnownCast.MAIN });

        const res = await getRoles('location=Berlin');
        byRole(res.body, 'Graf von Krolock').persons[0].numberOfShows.should.eql(1);
    });
});