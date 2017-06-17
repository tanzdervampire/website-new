// @flow

process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const moment = require('moment');
const Production = require('../models/production');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();

chai.use(chaiHttp);
describe('/api/productions', () => {
    beforeEach(async () => {
        await mongoose.connection.dropDatabase();
    });

    it('works', async () => {
        const res = await chai.request(server).get('/api/productions');
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(0);
    });

    it('returns a single production', async () => {
        await new Production({
            location: 'Stuttgart',
            theater: 'Palladium',
            start: moment.utc('01.01.2017', 'DD.MM.YYYY').toDate(),
            end: moment.utc('31.03.2017', 'DD.MM.YYYY').toDate(),
        }).save();

        const res = await chai.request(server).get('/api/productions');
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(1);

        res.body[0].should.be.a('object');
        res.body[0].should.have.property('location').eql('Stuttgart');
        res.body[0].should.have.property('theater').eql('Palladium');
        res.body[0].should.have.property('start').eql('2017-01-01T00:00:00.000Z');
        res.body[0].should.have.property('end').eql('2017-03-31T00:00:00.000Z');
    });

    it('returns productions in ascending order', async () => {
        await new Production({
            location: 'A',
            theater: 'Theater',
            start: moment.utc('02.01.2017', 'DD.MM.YYYY').toDate(),
            end: moment.utc('31.03.2017', 'DD.MM.YYYY').toDate(),
        }).save();

        await new Production({
            location: 'B',
            theater: 'Theaer',
            start: moment.utc('01.01.2017', 'DD.MM.YYYY').toDate(),
            end: moment.utc('31.03.2017', 'DD.MM.YYYY').toDate(),
        }).save();

        await new Production({
            location: 'C',
            theater: 'Theater',
            start: moment.utc('03.01.2017', 'DD.MM.YYYY').toDate(),
            end: moment.utc('31.03.2017', 'DD.MM.YYYY').toDate(),
        }).save();

        const res = await chai.request(server).get('/api/productions');
        res.should.have.status(200);
        res.body.length.should.be.eql(3);

        res.body[0].should.have.property('location').eql('B');
        res.body[1].should.have.property('location').eql('A');
        res.body[2].should.have.property('location').eql('C');
    });
});