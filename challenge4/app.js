require('module-alias/register');
require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const routes = require('./routes');

const app = express();
const host = process.env.HOST;
const port = process.env.PORT;
app.use(express.json());
app.use(morgan('common'));
app.use(express.urlencoded({ extended: false }));
app.use(routes);

app.listen(port, host, () => { console.log(`app running on http://${host}:${port}`); });
