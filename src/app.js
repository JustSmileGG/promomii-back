// Utils
const Express = require('express');
const bodyParser = require('body-parser');

const routes = require('./routes');

const app = Express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(routes);

module.exports = app;
