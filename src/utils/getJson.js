const log = require("debug")("salt:getJson");

async function getJson(url) {
  const res = await window.fetch(url);
  const isOK = res.status == 200 ? true : false;
  if (!isOK) {
    log("Status code from api is not ok");
    throw Error(`Failed to fetch ${url}`);
  }
  return await res.json();
}

module.exports = {
  getJson
};
