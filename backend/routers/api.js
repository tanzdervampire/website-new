// @flow

const router = require('express').Router();

const routers = {
    productions: require('./productions'),
    shows: require('./shows'),
    persons: require('./persons'),
    roles: require('./roles'),
    images: require('./images'),
};

router.use((req, res, next) => {
    if (req.body) {
        if (Object.keys(req.body).length !== 0 || req.body.constructor !== Object) {
            console.log(`REQUEST ${req.url}: ${JSON.stringify(req.body)}`);
        }
    }

    return next();
});

router.route('/status')
    .get((req, res) => res.json({ 'status': 'OK' }));

router.use('/productions', routers.productions);
router.use('/shows', routers.shows);
router.use('/persons', routers.persons);
router.use('/roles', routers.roles);
router.use('/images', routers.images);

router.use((err, req, res, next) => {
    console.error(`ERROR ${req.url}: ${err.stack}`);
    res.status(500);
    return next(err);
});

module.exports = router;