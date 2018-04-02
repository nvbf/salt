const braintree = require("braintree");

const gateway = braintree.connect({
  environment: braintree.Environment.Production,
  merchantId: process.env.BT_MERCHANT_ID,
  publicKey: process.env.BT_PUBLIC_KEY,
  privateKey: process.env.BT_PRIVATE_KEY
});

module.exports = gateway