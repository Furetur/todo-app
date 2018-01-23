const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const dbConfig = require('./config/db');
const setUpRoutes = require('./routes/index');


const app = express();

const port = 6969;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


mongoose.connect(dbConfig.url);
const db = mongoose.connection;
db.on('error', (e) => {
    console.warn('error while connecting to db:', e);
});
db.once('open', () => {
    console.log('Connected to database');

    setUpRoutes(app, db);

    app.use(express.static('public'));
    app.listen(port, () => {
        console.log(`Server is up on ${port}`);
    })
});

