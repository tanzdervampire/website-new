// @flow

process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const moment = require('moment');
const { prepareProductions } = require('./test-util');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

const getProductions = async () => {
    const res = await chai.request(server).get('/api/productions');
    res.should.have.status(200);
    res.body.should.be.a('array');
    return res;
};

chai.should();
chai.use(chaiHttp);

describe('/api/productions', () => {
    beforeEach(async () => {
        await mongoose.connection.dropDatabase();
    });

    it('works', async () => {
        const res = await getProductions();
        res.body.length.should.be.eql(0);
    });

    it('returns a single production', async () => {
        await prepareProductions({ numberOfProductions: 1 });

        const res = await getProductions();
        res.body.length.should.be.eql(1);

        res.body[0].should.be.a('object');
        res.body[0].should.have.property('location').eql('Berlin');
        res.body[0].should.have.property('theater').eql('Theater des Westens');
        res.body[0].should.have.property('start').eql('2016-04-24T00:00:00.000Z');
        res.body[0].should.have.property('end').eql('2016-09-25T23:59:59.999Z');
    });

    it('returns productions in ascending order', async () => {
        await prepareProductions({ numberOfProductions: 3 });

        const res = await getProductions();
        res.body.length.should.be.eql(3);

        res.body[0].should.have.property('location').eql('Berlin');
        res.body[1].should.have.property('location').eql('München');
        res.body[2].should.have.property('location').eql('Stuttgart');
    });
});