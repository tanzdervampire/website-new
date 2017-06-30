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
            return res.status(500).send('Internal error.');
        }
    });

module.exports = router;