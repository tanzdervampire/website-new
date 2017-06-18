// @flow

process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const moment = require('moment');
const { KnownProduction, KnownPerson, KnownCast, prepareShow, preparePerson, preparePersons, mergeCasts } = require('./test-util');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

const getPersons = async (fields = []) => {
    const res = await chai.request(server).get(`/api/persons?fields=${fields.join(',')}`);
    res.should.have.status(200);
    res.body.should.be.a('array');
    return res;
};

const byName = (body, name) => body.filter(p => p.name === name)[0];

chai.should();
chai.use(chaiHttp);

describe('/api/persons', () => {
    beforeEach(async () => {
        await mongoose.connection.dropDatabase();
    });

    it('works', async () => {
        const res = await getPersons();
        res.body.length.should.be.eql(0);
    });

    it('returns a single person', async () => {
        await preparePersons({ numberOfPersons: 1 });

        const res = await getPersons();
        res.body.length.should.be.eql(1);

        res.body[0].should.have.property('name').eql('Thomas Borchert');
        res.body[0].should.not.have.property('roles');
    });

    it('returns persons sorted by name', async () => {
        await preparePerson('B');
        await preparePerson('A');
        await preparePerson('C');

        const res = await getPersons();
        res.body.length.should.be.eql(3);

        res.body[0].should.have.property('name').eql('A');
        res.body[1].should.have.property('name').eql('B');
        res.body[2].should.have.property('name').eql('C');
    });

    it('returns persons with roles', async () => {
        await prepareShow({ date: moment('01.01.2017 19:30', 'DD.MM.YYYY HH:mm').toDate(), production: KnownProduction[0], cast: KnownCast.MAIN });

        const res = await getPersons(['roles']);
        res.body.length.should.be.eql(20);

        res.body.forEach(person => {
            person.should.have.property('roles');
            person.roles.should.be.a('array').that.has.length(1);
        });

        byName(res.body, 'Thomas Borchert').roles[0].should.eql('Graf von Krolock');
        byName(res.body, 'Csaba Nagy').roles[0].should.eql('Tanzsolisten');
    });

    it('returns the same response for two identical shows', async () => {
        await prepareShow({ date: moment('01.01.2017 14:30', 'DD.MM.YYYY HH:mm').toDate(), production: KnownProduction[0], cast: KnownCast.MAIN });
        const resOne = await getPersons(['roles']);

        await prepareShow({ date: moment('01.01.2017 19:30', 'DD.MM.YYYY HH:mm').toDate(), production: KnownProduction[0], cast: KnownCast.MAIN });
        const resTwo = await getPersons(['roles']);

        resOne.body.should.deep.eql(resTwo.body);
    });

    it('considers multiple roles within one show', async () => {
        const cast = mergeCasts(KnownCast.MAIN, [
            { role: 'Graf von Krolock', person: KnownPerson['Kirill Zolygin'] },
            { role: 'Gesangssolisten', person: KnownPerson['Kirill Zolygin'] },
        ]);
        await prepareShow({ date: moment('01.01.2017 19:30', 'DD.MM.YYYY HH:mm').toDate(), production: KnownProduction[0], cast });

        const res = await getPersons(['roles']);
        byName(res.body, 'Kirill Zolygin').roles.should.be.a('array').that.has.length(2);
        byName(res.body, 'Kirill Zolygin').roles.should.include.members(['Graf von Krolock', 'Gesangssolisten']);
    });

    // TODO FIXME Test across multiple shows (same + different role)
});