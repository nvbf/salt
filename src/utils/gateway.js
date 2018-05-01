const braintree = require("braintree");
const log = require("debug")("salt:gateway");

log(
  `Using env:: ${JSON.stringify(
    process.env.BT_SANDBOX
      ? braintree.Environment.Sandbox
      : braintree.Environment.Production
  )}`
);

const gateway = braintree.connect({
  environment: process.env.BT_SANDBOX
    ? braintree.Environment.Sandbox
    : braintree.Environment.Production,
  merchantId: process.env.BT_MERCHANT_ID,
  publicKey: process.env.BT_PUBLIC_KEY,
  privateKey: process.env.BT_PRIVATE_KEY
});

module.exports = gateway;
