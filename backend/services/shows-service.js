// @flow

const moment = require('moment');
const { sendNotificationEmail } = require('./email-service');
const Show = require('../models/show');
const Production = require('../models/production');
require('../models/person');

const postShow = async document => {
    const show = new Show(document);

    const err = show.validateSync();
    if (!err) {
        sendNotificationEmail(
            '[tanzdervampire.info] Show has been submitted',
            `
The following show has been submitted:

${JSON.stringify(document)}
            `
        );

        return show.save();
    } else {
        throw {
            status: 400,
            message: err,
        };
    }
};

const queryShowsBefore = async opts => {
    const before = opts.before ? moment(opts.before, 'YYYY-MM-DD', true).startOf('month') : moment();
    const latest = await Show.findOne().lean()
        .where('date').lt(before.toDate())
        .sort({ date: 'descending' })
        .limit(1);
    if (!latest) {
        return [];
    }

    const searchDate = moment(latest.date);
    return queryShows(Object.assign({}, opts, {
        year: searchDate.format('YYYY'),
        month: searchDate.format('MM'),
    }));
};

const queryShowBefore = async opts => {
    const { year, month, day } = opts;
    const beforeDate = moment(`${day}.${month}.${year}`, 'DD.MM.YYYY', true);

    const query = Show.findOne().lean()
        .where('date').lt(beforeDate.toDate());

    if (opts.location) {
        const productions = await Production.find({ location: opts.location });
        query.where('production').in(productions.map(p => p._id));
    }

    const latest = await query
        .sort({ date: 'descending' })
        .limit(1);
    if (!latest) {
        return [];
    }

    const searchDate = moment(latest.date);
    const documents = await queryShows(Object.assign({}, opts, {
        year: searchDate.format('YYYY'),
        month: searchDate.format('MM'),
        day: searchDate.format('DD'),
    }));

    /* Only return the latest one. */
    return [documents.pop()];
};

const queryShows = async opts => {
    const { year, month, day } = opts;
    const fields = opts.fields ? opts.fields.split(/,/) : [];

    const base = moment(`${day || '01'}.${month}.${year}`, 'DD.MM.YYYY', true);
    if (!base.isValid()) {
        throw {
            status: 400,
            message: 'Invalid input',
        };
    }

    const from = base.clone().startOf(day ? 'day' : 'month');
    const until = base.clone().endOf(day ? 'day' : 'month');
    let query = Show.find().lean().where('date')
        .gte(from.toDate())
        .lte(until.toDate());

    if (opts.location) {
        const productions = await Production.find({ location: opts.location });
        query.where('production').in(productions.map(p => p._id));
    }

    if (fields.includes('production')) {
        query.populate('production');
    } else {
        query.select({ production: false });
    }

    if (fields.includes('cast')) {
        query.populate('cast.person');
    } else {
        query.select({ cast: false });
    }

    if (opts.count) {
        query.count();
    } else {
        query.sort({ date: 'ascending' });
    }

    return query;
};

module.exports = { postShow, queryShows, queryShowBefore, queryShowsBefore };