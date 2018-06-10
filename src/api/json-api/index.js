const axios = require("axios");
const log = require("debug")("salt:src:api:json-api");
const CircularJSON = require("circular-json");
const API_URL = process.env.API_URL;
const norwegianTournamentsTypes = ["RT Open", "NT Open", "NT Master", "LT"];
import { rollbar } from "../../utils/rollbar";
const groupByGender = require("../../utils/groupByGender");

async function apiRegisterTeamForTournament(data) {
  try {
    log(`Send to axios: ${CircularJSON.stringify(data)}`);
    const response = await axios.post(`${API_URL}/RegisterTeam`, data);
    if (response.status != 200) {
      return {
        statusText: response.statusText,
        status: response.status,
        message: CircularJSON.stringify(
          response.data || response.body || response.text
        )
      };
    }
    return response.data;
  } catch (error) {
    const { config: { method = "", url = "", data = {} } = {} } = error;
    log("Error in posting team - " + CircularJSON.stringify(error));
    log(
      `Error in posting team - method: ${method}, url: ${url} data: ${CircularJSON.stringify(
        data
      )}`
    );

    return {
      statusText: "error",
      status: "503",
      message: CircularJSON.stringify(error)
    };
  }
}

async function apiGetPointsFromPlayer(id) {
  const res = await axios.get(`${API_URL}/points?SpillerId=${id}`);
  return res.data;
}

async function apiGetRanking() {
  const result = await axios.get(`${API_URL}/points`);
  const playersRes = await axios.get(`${API_URL}/players`);
  const playerData = getData(playersRes);
  const data = getData(result);

  const playerSum = data.reduce((lastValue = {}, currentValue, index, {}) => {
    if (lastValue.currentSpillerId == currentValue.SpillerId) {
      lastValue[currentValue.SpillerId].sum += currentValue.Poeng;
    } else {
      lastValue.currentSpillerId = currentValue.SpillerId;
      const playerArray = playerData.filter(
        player => player.SpillerId === lastValue.currentSpillerId
      );
      lastValue[currentValue.SpillerId] = {};

      if (playerArray.length === 0) {
        rollbar.warn(
          `Seems like a mismatch on id between /players and /points ${CircularJSON.stringify(
            currentValue
          )}`
        );
        return lastValue;
      }

      lastValue[currentValue.SpillerId].name =
        playerArray[0].Fornavn + " " + playerArray[0].Etternavn;
      lastValue[currentValue.SpillerId].gender = playerArray[0].Kjonn;
      lastValue[currentValue.SpillerId].sum = currentValue.Poeng;
    }
    return lastValue;
  });
  const keys = Object.keys(playerSum);
  const players = keys.filter(key => Number.isInteger(Number(key)));
  const playerObjects = players.map(key => ({
    id: key,
    gender: playerSum[key].gender,
    name: playerSum[key].name,
    sum: playerSum[key].sum
  }));
  const sortedRanking = playerObjects.sort((a, b) => b.sum - a.sum);
  return sortedRanking;
}

async function apiGetPlayer(id) {
  const players = await apiGetPlayers();
  const playersArray = players.filter(({ SpillerId }) => SpillerId == id);

  if (playersArray.length === 0) {
    return { noSuchPlayer: "No such player id" };
  }
  return playersArray[0];
}
async function apiGetPlayers() {
  const result = await axios.get(`${API_URL}/players`);
  return getData(result);
}

async function apiGetTournament(id) {
  const tournaments = await apiGetTournaments(`?TurneringsId=${id}&Lag=True`);
  const tournamentArray = tournaments.filter(
    ({ TurneringsId }) => TurneringsId == id
  );
  if (tournamentArray.length === 0) {
    return { noSuchTournament: "No such tournamentID" };
  }
  return tournamentArray[0];
}
async function apiGetTournaments(extraQueryString = "") {
  log(`request URL: ${API_URL}/tournaments${extraQueryString}`);
  const result = await axios.get(`${API_URL}/tournaments${extraQueryString}`);
  const data = getData(result);
  return data;
}

async function apiGetPoints() {
  log(`request URL: ${API_URL}/points`);
  const result = await axios.get(`${API_URL}/points`);
  const data = getData(result);
  return data;
}

function getData(result) {
  if (result.status !== 200) {
    log(`Did not get a 200 response from API, details: ${result}`);
    throw new Error(`Did not get a 200 response from API, details: ${result}`);
  }

  if (typeof result.data == "string") {
    console.log("Hacking");
    const newData = result.data.replace(
      /select \* from Turnering[\t\s\r\n]+/g,
      ""
    );
    return JSON.parse(newData);
  }

  return result.data;
}

module.exports = {
  apiGetRanking,
  apiGetPlayer,
  apiGetPlayers,
  apiGetTournament,
  apiGetTournaments,
  apiRegisterTeamForTournament,
  apiGetPointsFromPlayer,
  apiGetPoints
};
