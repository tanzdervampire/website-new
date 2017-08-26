// @flow

const router = require('express').Router();
const { queryRoles } = require('../services/roles-service');

// TODO FIXME Only return persons (and persons.numberOfShows) on request?
const findRoles = req => {
    return queryRoles({
        role: req.params.role,
        location: req.query.location,
    });
};

/**
 * /
 *
 * GET
 * Returns a list of roles and which persons have played this role.
 *
 * Query parameters:
 *  location
 *      Only consider shows in the given location.
 *      If this is not specified, data for all locations will be returned.
 */
router.route('/')
    .get(async (req, res) => {
        try {
            const documents = await findRoles(req);
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

/**
 * /:role
 *
 * GET
 * Returns a list of persons who have played this role.
 *
 * Query parameters:
 *  location
 *      Only consider shows in the given location.
 *      If this is not specified, data for all locations will be returned.
 */
router.route('/:role')
    .get(async (req, res) => {
        try {
            const documents = await findRoles(req);
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