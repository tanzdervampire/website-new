// @flow

const router = require('express').Router();
const Production = require('../models/production');

router.route('/')
    .get(async (req, res) => {
        try {
            const documents = await Production.find({}).sort({ start: 'ascending' });
            return res.json(documents);
        } catch (err) {
            return res.status(500).send('Internal error.');
        }
    });

module.exports = router;