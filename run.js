require('dotenv').config()
require = require("esm")(module, { cjs: true });
module.exports = require("./src/server.js").default;
