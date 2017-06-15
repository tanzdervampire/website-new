// @flow

const router = require('express').Router();
const Person = require('../models/person');

/**
 * /
 *
 * GET
 * Returns a list of all persons.
 * This list is sorted alphabetically by name.
 */
router.route('/')
    .get(async (req, res) => {
        try {
            const documents = await Person.find({}).sort({ name: 'ascending' });
            return res.json(documents);
        } catch (err) {
            return res.send(err);
        }
    });

// TODO FIXME List of people participating in a specific production.
// TODO FIXME Return list of people by role.

module.exports = router;