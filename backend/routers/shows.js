// @flow

const router = require('express').Router();
const { queryShows, queryShowsBefore } = require('../services/shows-service');

/**
 * /by-month/latest
 *
 * GET
 * Returns the shows for the latest month for which data is available.
 *
 * Query parameters:
 *  before
 *      Return data for the latest month before the given date. The given
 *      date's month is considered to be exclusive.
 *      Expected format is YYYY-MM-DD. If omitted, the latest available month
 *      is returned.
 *  location
 *      Only return shows performed in the given location.
 *  fields
 *      Comma-separated list of additional fields to be returned.
 *      Possible values are 'production' and 'cast'.
 *  count
 *      If set, only the number of matching shows will be returned.
 */
router.route('/by-month/latest')
    .get(async (req, res) => {
        try {
            const documents = await queryShowsBefore({
                before: req.query.before,
                fields: req.query.fields,
                location: req.query.location,
                count: !!req.query.count,
            });

            return res.json(documents);
        } catch (err) {
            return res.send(err);
        }
    });

// TODO FIXME Add production parameter.
/**
 * /:year/:month
 *
 * GET
 * Returns a list of shows during the specified month.
 * The list is sorted by date.
 *
 * Query parameters:
 *  location
 *      Only return shows performed in the given location.
 *  fields
 *      Comma-separated list of additional fields to be returned.
 *      Possible values are 'production' and 'cast'.
 *  count
 *      If set, only the number of matching shows will be returned.
 */
router.route('/:year/:month')
    .get(async (req, res) => {
        try {
            const documents = await queryShows({
                year: req.params.year,
                month: req.params.month,
                fields: req.query.fields,
                location: req.query.location,
                count: !!req.query.count,
            });

            return res.json(documents);
        } catch (err) {
            return res.send(err);
        }
    });

// TODO FIXME Add production parameter.
/**
 * /:year/:month/:day
 *
 * GET
 * Returns a list of shows on the specified day.
 * The list is sorted by date.
 *
 * Query parameters:
 *  location
 *      Only return shows performed in the given location.
 *  fields
 *      Comma-separated list of additional fields to be returned.
 *      Possible values are 'production' and 'cast'.
 *  count
 *      If set, only the number of matching shows will be returned.
 */
router.route('/:year/:month/:day')
    .get(async (req, res) => {
        try {
            const documents = await queryShows({
                year: req.params.year,
                month: req.params.month,
                day: req.params.day,
                fields: req.query.fields,
                location: req.query.location,
                count: !!req.query.count,
            });

            return res.json(documents);
        } catch (err) {
            return res.send(err);
        }
    });

module.exports = router;