// @flow

const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const apiRouter = require('./routers/api');

const app = express();
app.use(cors());

mongoose.Promise = global.Promise;
const options = { useMongoClient: true };
switch (process.env.NODE_ENV) {
    case 'dev':
        app.options('*', cors());
        app.set('port', 3001);
        app.set('json spaces', 4);
        mongoose.connect('mongodb://localhost/tdv', options);
        break;
    case 'test':
        app.options('*', cors());
        app.set('port', 3002);
        app.set('json spaces', 4);
        mongoose.connect('mongodb://localhost/tdv-test', options);
        break;
    case 'production':
        app.set('port', process.env.PORT);
        app.use(express.static('../frontend/www'));
        mongoose.connect(process.env.MONGODB_URI, options);
        break;
    default:
        throw new Error('Unknown environment!');
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api', apiRouter);

/* In the browser, we don't need this file. Avoid redirecting it to index.html. */
app.get('cordova.js', (req, res) => {
    res.send('');
});

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'frontend', 'www', 'index.html'));
});

app.listen(app.get('port'), () => {
    console.log(`Find the server at: http://localhost:${app.get('port')}/`);
});

process.on('exit', () => {
    mongoose.connection.close();
});

module.exports = app;
