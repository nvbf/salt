const braintree = require("braintree");
const gateway = require("./gateway");

function getClientToken() {
  return new Promise((resolve, reject) => {
    gateway.clientToken.generate({}, function(err, response) {
      if (err) return reject(err);
      resolve(response.clientToken);
    });
  });
}

module.exports = getClientToken;
