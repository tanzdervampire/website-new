// @flow

process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const { preparePerson, preparePersons } = require('./test-util');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

const getPersons = async (fields = []) => {
    const res = await chai.request(server).get(`/api/persons?fields=${fields.join(',')}`);
    res.should.have.status(200);
    res.body.should.be.a('array');
    return res;
};

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

    xit('returns persons with roles', async () => {
        // TODO FIXME Implement test
    })
});