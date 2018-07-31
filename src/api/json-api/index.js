import axios from "axios";
import { rollbar } from "../../utils/rollbar";

const log = require("debug")("salt:src:api:json-api");
const CircularJSON = require("circular-json");

const API_URL2 = process.env.API_URL2;

async function apiRegisterTeamForTournament(data) {
  try {
    log(`Send to axios: ${CircularJSON.stringify(data)}`);
    const response = await axios.post(`${API_URL2}/RegisterTeam`, data);
    if (response.status !== 200) {
      log(
        `Error in posting team - Status !== 200: : ${CircularJSON.stringify(
          data
        )}`
      );
      return {
        statusText: response.statusText,
        status: response.status,
        message: CircularJSON.stringify(response.data)
      };
    }
    return response.data;
  } catch (error) {
    const { config: { method = "", url = "", data = {} } = {} } = error;
    log(error.response);
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
  const res = await axios.get(`${API_URL2}/points/${id}`);
  return res.data;
}

async function apiGetRanking(klasse) {
  const result = await axios.get(`${API_URL2}/points`);
  const playersRes = await axios.get(`${API_URL2}/players/${klasse}`);
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
async function apiGetPlayers(klasse) {
  const result = await axios.get(`${API_URL2}/players/${klasse}`);
  return getData(result);
}

async function apiGetTournament(id) {
  log(`request URL: ${API_URL2}/tournaments/${id}`);
  const result = await axios.get(`${API_URL2}/tournaments/${id}`);
  const tournament = getData(result);
  if (!tournament) {
    return { noSuchTournament: "No such tournamentID" };
  }
  return tournament;
}

async function apiGetTournaments(extraQueryString = "") {
  log(`request URL: ${API_URL2}/tournaments${extraQueryString}`);
  const result = await axios.get(`${API_URL2}/tournaments${extraQueryString}`);
  const data = getData(result);
  return data;
}

async function apiGetTournamentsInTheFuture() {
  log(`request URL: ${API_URL2}/tournaments/future`);
  const result = await axios.get(`${API_URL2}/tournaments/future`);
  const data = getData(result);
  return data;
}

async function apiGetTournamentsthatIsFinished() {
  log(`request URL: ${API_URL2}/tournaments/finished`);
  const result = await axios.get(`${API_URL2}/tournaments/finished`);
  const data = getData(result);
  return data;
}

async function apiGetPoints() {
  log(`request URL: ${API_URL2}/points`);
  const result = await axios.get(`${API_URL2}/points`);
  const data = getData(result);
  return data;
}

async function apiPointsFromTournament(id) {
  log(`request URL: ${API_URL2}/tournaments/${id}/results`);
  const result = await axios.get(`${API_URL2}/tournaments/${id}/results`);
  const data = getData(result);
  return data;
}

function getData(result) {
  if (result.status !== 200) {
    log(`Did not get a 200 response from API, details: ${result}`);
    throw new Error(`Did not get a 200 response from API, details: ${result}`);
  }

  return result.data;
}

module.exports = {
  apiGetRanking,
  apiGetPlayer,
  apiGetPlayers,
  apiGetTournament,
  apiGetTournaments,
  apiGetTournamentsInTheFuture,
  apiGetPointsFromPlayer,
  apiGetPoints,
  apiRegisterTeamForTournament,
  apiGetTournamentsthatIsFinished,
  apiPointsFromTournament
};
