// @flow

/**
 * A simple type enum for fragments.
 */
const FragmentType = {
    /* Initial type of all fragments. */
    UNKNOWN: 0,
    /* This fragment is a role fragment, i.e., it holds the name of a role. */
    ROLE: 1,
    /* This fragment is a name fragment, i.e., it holds a single name or a list of names. */
    NAME: 2,
    /* Anything else. */
    OTHER: 3,
};

/**
 * The available roles.
 * Each role has the following properties:
 *  - synonyms: A list of alternative spellings.
 *  - primary: Whether this role appears on the main cast part.
 *  - singular: Whether the role may only be taken by a single person.
 */
const Role = {
    'Graf von Krolock': {
        synonyms: [],
        primary: true,
        singular: true
    },
    'Sarah': {
        synonyms: [],
        primary: true,
        singular: true
    },
    'Alfred': {
        synonyms: [],
        primary: true,
        singular: true
    },
    'Professor Abronsius': {
        synonyms: [ 'Prof. Abronsius' ],
        primary: true,
        singular: true
    },
    'Chagal': {
        synonyms: [],
        primary: true,
        singular: true
    },
    'Magda': {
        synonyms: [],
        primary: true,
        singular: true
    },
    'Herbert': {
        synonyms: [],
        primary: true,
        singular: true
    },
    'Rebecca': {
        synonyms: [],
        primary: true,
        singular: true
    },
    'Koukol': {
        synonyms: [],
        primary: true,
        singular: true
    },
    'Tanzsolisten': {
        synonyms: [ 'Solotänzer' ],
        primary: false,
        singular: false
    },
    'Gesangssolisten': {
        synonyms: [],
        primary: false,
        singular: false
    },
    'Tanzensemble': {
        synonyms: [],
        primary: false,
        singular: false
    },
    'Gesangsensemble': {
        synonyms: [],
        primary: false,
        singular: false
    },
    'Dirigent': {
        synonyms: [],
        primary: false,
        singular: true
    },
};

module.exports = { FragmentType, Role };