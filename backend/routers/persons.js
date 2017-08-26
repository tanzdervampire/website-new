// @flow

const router = require('express').Router();
const { queryPersons } = require('../services/persons-service');

/**
 * /
 *
 * GET
 * Returns a list of all persons.
 * This list is sorted alphabetically by name.
 *
 * Query parameters:
 *  fields
 *      Comma-separated list of additional fields to return.
 *      Possible values are 'roles'.
 */
router.route('/')
    .get(async (req, res) => {
        try {
            const documents = await queryPersons({ fields: req.query.fields });
            return res.json(documents);
        } catch (err) {
            if (err && err.status) {
                res.status(err.status);
            } else {
                res.status(500);
            }

            return res.send(err);
        }
    });

module.exports = router;