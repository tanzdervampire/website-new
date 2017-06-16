// @flow

const router = require('express').Router();
const Show = require('../models/show');

const findPersons = async () => {
    return Show.aggregate([
        /* We need one entry per cast member. */
        { $unwind: '$cast' },

        /* Reduce it to the only data we are interested in. */
        { $project: { role: '$cast.role', person: '$cast.person' } },

        /* Group by person into a set of roles. */
        {
            $group: {
                _id: '$person',
                roles: { $addToSet: '$role' }
            }
        },

        /* Load the actual person information. */
        {
            $lookup: {
                from: 'persons',
                localField: '_id',
                foreignField: '_id',
                as: 'person'
            }
        },

        /* $lookup returns person as an array, but it only has one value, so unwind it. */
        { $unwind: '$person' },

        /* Add the roles to the person sub-document. */
        { $addFields: { 'person.roles': '$roles' } },

        /* Replace the root since we now have everything in our person sub-document. */
        { $replaceRoot: { newRoot: '$person' } },

        /* Lastly, let's sort the list. */
        { $sort: { name: 1 } }
    ]);
};

const findRoles = req => {
    const roles = req.query.roles ? req.query.roles.split(/,/) : [];

    let stages = [];

    /* We need one entry per cast member. */
    stages.push({ $unwind: '$cast' });

    if (roles.length !== 0) {
        stages.push({ $match: { 'cast.role': { $in: roles } } });
    }

    /* Reduce it to the only data we are interested in. */
    stages.push({ $project: { role: '$cast.role', person: '$cast.person' } });

    /* Load the actual person information. */
    stages.push({
        $lookup: {
            from: 'persons',
            localField: 'person',
            foreignField: '_id',
            as: 'person'
        }
    });

    /* $lookup returns person as an array, but it only has one value, so unwind it. */
    stages.push({ $unwind: '$person' });

    /* Group by role into a set of persons. */
    stages.push({
        $group: {
            _id: '$role',
            persons: { $addToSet: '$person' }
        }
    });

    return Show.aggregate(stages);
};

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
            const documents = await findPersons();
            return res.json(documents);
        } catch (err) {
            return res.send(err);
        }
    });

// TODO FIXME Allow restricting to a production / location / …
/**
 * /roles
 *
 * GET
 * Returns a list of roles and which persons have played this role.
 *
 * Query parameters:
 *  roles
 *      Comma-separated list of roles for which data shall be returned.
 */
router.route('/roles')
    .get(async (req, res) => {
        try {
            const documents = await findRoles(req);
            return res.json(documents);
        } catch (err) {
            return res.send(err);
        }
    });

module.exports = router;