// @flow

const router = require('express').Router();
const Person = require('../models/person');
const Show = require('../models/show');

const findPersonsWithRoles = async () => {
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

const findPersons = async req => {
    const fields = req.query.fields ? req.query.fields.split(/,/) : [];

    /* If roles are not requested, we can take a shortcut. */
    return fields.includes('roles')
        ? await findPersonsWithRoles()
        : await Person.find({}).lean().sort({ name: 1 });
};

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
            const documents = await findPersons(req);
            return res.json(documents);
        } catch (err) {
            return res.send(err);
        }
    });

module.exports = router;