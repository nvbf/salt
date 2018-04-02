require('dotenv').config()
require = require("@std/esm")(module, { cjs: true, esm: "js" });
module.exports = require("./src/server.js").default;
