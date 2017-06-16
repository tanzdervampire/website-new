// @flow

const router = require('express').Router();
const Person = require('../models/person');
const Show = require('../models/show');

const getPersonToRolesMapping = () => {
    return Show.aggregate([
        /* We need one entry per cast member. */
        { $unwind: '$cast' },
        /* Reduce it to the only data we are interested in. */
        { $project: { role: '$cast.role', person: '$cast.person' } },
        /* Group by person name into a set of roles. */
        {
            $group: {
                _id: '$person',
                roles: { $addToSet: '$role' }
            }
        }
    ]);
};

const findPersons = async (req, res) => {
    const fields = req.query.fields ? req.query.fields.split(/,/) : [];

    const documents = await Person.find({}).lean()
        .sort({ name: 'ascending' });

    if (fields.includes('roles')) {
        const mappings = await getPersonToRolesMapping();
        documents.forEach(doc => {
            const mapping = mappings.filter(m => m._id.toString() === doc._id.toString());
            if (mapping && mapping.length === 1) {
                doc.roles = mapping[0].roles;
            }
        });
    }

    return documents;
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
 *      Comma-separated list of additional fields to be returned.
 *      Possible values are 'roles'.
 */
router.route('/')
    .get(async (req, res) => {
        try {
            const documents = await findPersons(req, res);
            return res.json(documents);
        } catch (err) {
            return res.send(err);
        }
    });

// TODO FIXME Return list of people by role.

module.exports = router;