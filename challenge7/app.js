require('module-alias/register');
require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const Sentry = require('@sentry/node');
const { ProfilingIntegration } = require('@sentry/profiling-node');
const flash = require('express-flash');
const session = require('express-session');
const path = require('path');
const swaggerUI = require('swagger-ui-express');
const routes = require('./src/routes');
const swaggerJSON = require('./openapi.json');

const app = express();
const host = process.env.HOST;
const port = process.env.PORT;
app.use(express.json());
app.use(morgan('common'));
app.use(express.urlencoded({ extended: false }));
Sentry.init({
  dsn: 'https://5d93340aa9e157f535b4d881a5642539@o4506292984020992.ingest.sentry.io/4506292985856000',
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Express({ app }),
    new ProfilingIntegration(),
  ],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());

app.use(Sentry.Handlers.tracingHandler());

app.get('/debug-sentry', (req, res) => {
  throw new Error('My first Sentry error!');
});
app.use(routes);
app.use(session({ // config middleware session
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
}));
app.use(flash());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './src/view'));
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerJSON));
// app.use(Sentry.Handlers.errorHandler());

// app.use((err, req, res, next) => {
//   res.statusCode = 500;
//   res.end(`${res.sentry}\n`);
// });
if (!module.parent) {
  const server = app.listen(port, host, () => {
    console.log(`app running on http://${host}:${port}`);
  });

  app.close = (callback) => {
    server.close(callback);
  };
}
module.exports = app;
