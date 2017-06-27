// @flow

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const apiRouter = require('./routers/api');

const app = express();
mongoose.Promise = global.Promise;
switch (process.env.NODE_ENV) {
    case 'dev':
        app.set('port', 3001);
        app.set('json spaces', 4);
        mongoose.connect('mongodb://localhost/tdv');
        break;
    case 'test':
        app.set('port', 3002);
        app.set('json spaces', 4);
        mongoose.connect('mongodb://localhost/tdv-test');
        break;
    case 'production':
        app.set('port', process.env.PORT);
        app.use(express.static('../frontend/build'));
        mongoose.connect(process.env.MONGODB_URI);
        break;
    default:
        throw new Error('Unknown environment!');
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api', apiRouter);

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'frontend', 'build', 'index.html'));
});

app.listen(app.get('port'), () => {
    console.log(`Find the server at: http://localhost:${app.get('port')}/`);
});

process.on('exit', () => {
    mongoose.connection.close();
});

module.exports = app;