require('module-alias/register');
require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const swaggerUI = require('swagger-ui-express');
const routes = require('./src/routes');

const swaggerJSON = require('./openapi.json');

const app = express();
const host = process.env.HOST;
const port = process.env.PORT;
app.use(express.json());
app.use(morgan('common'));
app.use(express.urlencoded({ extended: false }));
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerJSON));
app.use(routes);

if (!module.parent) {
  const server = app.listen(port, host, () => {
    console.log(`app running on http://${host}:${port}`);
  });

  app.close = (callback) => {
    server.close(callback);
  };
}
module.exports = app;
