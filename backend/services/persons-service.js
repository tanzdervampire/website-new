// @flow

const Person = require('../models/person');
const Show = require('../models/show');

const queryPersonsWithRoles = async () => {
    const allPersons = await Person.find({}).lean().sort({ name: 1 });
    const personsWithRole = await Show.aggregate([
        /* We need one entry per cast member. */
        { $unwind: '$cast' },

        /* Reduce it to the only data we are interested in. */
        { $project: { role: '$cast.role', person: '$cast.person' } },

        /* Group with the role as part of the group key to count the number of shows in this role and remove duplicates. */
        {
            $group: {
                _id: { person: '$person', role: '$role' },
                count: { $sum: 1 },
            }
        },

        /* Sort by the number of shows. */
        { $sort: { count: -1 } },

        /* Roll up further to get one entry per person with an ordered roles array. */
        {
            $group: {
                _id: '$_id.person',
                roles: { $push: '$_id.role' },
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

    const namesWithRole = personsWithRole.map(p => p.name);
    const result = [];
    allPersons.forEach(person => {
        const personWithRole = personsWithRole.find(p => p.name === person.name);
        if (personWithRole) {
            result.push(personWithRole);
        } else {
            result.push({ ...person, roles: [] });
        }
    });

    return result;
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
