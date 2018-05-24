const Rollbar = require("rollbar");
export const rollbar = new Rollbar({
  accessToken: process.env.ROLLBAR_API_KEY,
  environment: process.env.NODE_ENV,
  verbose: true
});
