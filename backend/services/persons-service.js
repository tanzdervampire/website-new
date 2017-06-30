// @flow

const Person = require('../models/person');
const Show = require('../models/show');

const queryPersonsWithRoles = async () => {
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

// TODO FIXME Get rid of the shortcut and instead make aggregate() smarter.
const queryPersons = async opts => {
    const fields = opts.fields ? opts.fields.split(/,/) : [];

    /* If roles are not requested, we can take a shortcut. */
    return fields.includes('roles')
        ? await queryPersonsWithRoles()
        : await Person.find({}).lean().sort({ name: 1 });
};

module.exports = { queryPersons };