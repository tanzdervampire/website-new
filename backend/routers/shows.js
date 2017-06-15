// @flow

const router = require('express').Router();
const moment = require('moment');
const Show = require('../models/show');
const Person = require('../models/person');
const Production = require('../models/production');

const findShows = async (req, res) => {
    const { year, month, day } = req.params;
    const fields = req.query.fields ? req.query.fields.split(/,/) : [];

    const base = moment(`${day || '01'}.${month}.${year}`, 'DD.MM.YYYY');
    if (!base.isValid()) {
        res.status(400);
        throw 'Invalid input.';
    }

    const from = base.clone().startOf(day ? 'day' : 'month');
    const until = base.clone().endOf(day ? 'day' : 'month');
    let query = Show.find().where('date')
        .gte(from.toDate())
        .lte(until.toDate());

    if (req.query.location) {
        const productions = await Production.find({ location: req.query.location });
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

    query.sort({ date: 'ascending' });
    return query;
};

/**
 * /:year/:month
 *
 * GET
 * Returns a list of shows during the specified month.
 *
 * Query parameters:
 *  location
 *      Only return shows performed in the given location.
 *  fields
 *      Comma-separated list of additional fields to be returned.
 *      Possible values are 'production' and 'cast'.
 */
router.route('/:year/:month')
    .get(async (req, res) => {
        try {
            const documents = await findShows(req, res);
            return res.json(documents);
        } catch (err) {
            return res.send(err);
        }
    });

/**
 * /:year/:month/:day
 *
 * GET
 * Returns a list of shows on the specified day.
 *
 * Query parameters:
 *  location
 *      Only return shows performed in the given location.
 *  fields
 *      Comma-separated list of additional fields to be returned.
 *      Possible values are 'production' and 'cast'.
 */
router.route('/:year/:month/:day')
    .get(async (req, res) => {
        try {
            const documents = await findShows(req, res);
            return res.json(documents);
        } catch (err) {
            return res.send(err);
        }
    });

module.exports = router;