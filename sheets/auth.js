import debug from "debug";

let google = require("googleapis");
let privatekey;

const log = debug("auth");

try {
  privatekey = require("../service-account.json");
} catch (e) {
  log("Cant find a service-account key, fallback to ENV.");
  privatekey = {};
  privatekey.type = process.env.type;
  privatekey.project_id = process.env.project_id;
  privatekey.private_key_id = process.env.private_key_id;
  privatekey.private_key = JSON.parse(process.env.private_key).key;
  privatekey.client_email = process.env.client_email;
  privatekey.client_id = process.env.client_id;
  privatekey.auth_uri = process.env.auth_uri;
  privatekey.token_uri = process.env.token_uri;
  privatekey.auth_provider_x509_cert_url =
    process.env.auth_provider_x509_cert_url;
  privatekey.client_x509_cert_url = process.env.client_x509_cert_url;
  if (!privatekey.type) {
    throw "process.env.type not defined, cant authenticate!";
  }
}

/**
 * Return a jwtClient that is authenticated and can be used in the googleapis
 */
export default async function auth() {
  return new Promise((resolve, reject) => {
    const jwtClient = new google.auth.JWT(
      privatekey.client_email,
      null,
      privatekey.private_key,
      ["https://www.googleapis.com/auth/spreadsheets"]
    );

    //authenticate request
    jwtClient.authorize(function(err, tokens) {
      if (err) {
        log("Authentication failed");
        reject(err);
      } else {
        log("Successfully authorize!");
        resolve(jwtClient);
      }
    });
  });
}
