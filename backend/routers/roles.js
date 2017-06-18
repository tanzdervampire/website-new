// @flow

const router = require('express').Router();
const Show = require('../models/show');

// TODO FIXME Only return persons (and persons.numberOfShows) on request?
const findRoles = req => {
    const roles = req.query.roles ? req.query.roles.split(/,/) : [];

    let stages = [];

    /* We need one entry per cast member. */
    stages.push({ $unwind: '$cast' });

    if (roles.length !== 0) {
        /* Filter by role. */
        stages.push({ $match: { 'cast.role': { $in: roles } } });
    }

    if (req.query.location) {
        /* Load the production information. */
        stages.push({
            $lookup: {
                from: 'productions',
                localField: 'production',
                foreignField: '_id',
                as: 'production'
            }
        });

        /* Filter by location. */
        stages.push({ $match: { 'production.location': req.query.location } });
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

    /* Group by role and person so we can also calculate the number of shows. */
    stages.push({
        $group: {
            _id: { role: '$role', person: '$person' },
            numberOfShows: { $sum: 1 },
        }
    });

    /* Move numberOfShows into the person sub-document. */
    stages.push({ $addFields: { '_id.person.numberOfShows': '$numberOfShows' } });

    /* Get rid of the _id wrapper. */
    stages.push({ $project: { _id: 0, role: '$_id.role', person: '$_id.person' } });

    /* Group by role to get rid of duplicate persons. */
    stages.push({
        $group: {
            _id: '$role',
            persons: { $addToSet: '$person' },
        }
    });

    /* Rename _id into role. */
    stages.push({ $project: { persons: 1, role: '$_id', _id: 0 } });

    /* Basically undo the grouping so we can sort by number of shows after having removed duplicates. */
    stages.push({ $unwind: '$persons' });

    /* Sort by role, number of shows and name. */
    stages.push({ $sort: { role: 1, 'persons.numberOfShows': -1, 'persons.name': 1 } });

    /* Group once again. This time we use $push to preserve the sorted order; duplicates no longer exist anyway. */
    stages.push({
        $group: {
            _id: '$role',
            persons: { $push: '$persons' },
        }
    });

    /* Rename _id into role again. */
    stages.push({ $project: { persons: 1, role: '$_id', _id: 0 } });

    return Show.aggregate(stages);
};

/**
 * /
 *
 * GET
 * Returns a list of roles and which persons have played this role.
 *
 * Query parameters:
 *  roles
 *      Comma-separated list of roles for which data shall be returned.
 *      If this is not specified, data for all roles will be returned.
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
            return res.send(err);
        }
    });

module.exports = router;