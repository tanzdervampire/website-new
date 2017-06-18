// @flow

process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const moment = require('moment');
//const { KnownProduction, KnownPerson, KnownCast, prepareShow } = require('./test-util');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

chai.should();
chai.use(chaiHttp);

describe('/api/shows', () => {
    beforeEach(async () => {
        await mongoose.connection.dropDatabase();
    });

    xit('works', async () => {
        // TODO FIXME Implement.
    });
});