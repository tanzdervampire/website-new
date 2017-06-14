// @flow

const router = require('express').Router();
const Production = require('../models/production');

router.route('/')
    .get((req, res) => {
        Production.find({}, (err, items) => {
            if (err) {
                return res.status(500).send(err);
            }

            res.json(items);
        });
    });

module.exports = router;