const { app, http } = require('../setupServer.js');
const Raven = require('raven');

// Load environment configurations
const keys = require('../config/keys');

// Error notifications
if (keys.sentryDsn) {
  Raven.config(keys.sentryDsn).install();
  app.use(Raven.requestHandler());
  app.use(Raven.errorHandler());
} else {
  console.log("no sentry DSN for you")
}
