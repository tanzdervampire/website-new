// @flow

const router = require('express').Router();
const { queryProductions } = require('../services/productions-service');

// TODO FIXME List of people participating in a specific production.

/**
 * /
 *
 * GET
 * Returns a list of productions.
 * This list is sorted by date.
 */
router.route('/')
    .get(async (req, res) => {
        try {
            const documents = await queryProductions();
            return res.json(documents);
        } catch (err) {
            if (err && err.status) {
                res.status(err.status);
            } else {
                res.status(500);
            }

            return res.send('Internal error.');
        }
    });

module.exports = router;