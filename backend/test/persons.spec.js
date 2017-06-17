// @flow

process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const { preparePerson } = require('./test-util');

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
        await preparePerson('Steve Barton');

        const res = await getPersons();
        res.body.length.should.be.eql(1);

        res.body[0].should.have.property('name').eql('Steve Barton');
        res.body[0].should.not.have.property('roles');
    });

    xit('returns persons sorted by name', async () => {});
});