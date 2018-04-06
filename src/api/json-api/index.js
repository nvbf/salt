const axios = require("axios");
const log = require("debug")("salt:src:api:json-api");
const CircularJSON = require("circular-json");
const API_URL = process.env.API_URL;

const norwegianTournamentsTypes = ["RT Open", "NT Open", "NT Master", "LT"];

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
    log("Error in posting team - " + CircularJSON.stringify(error));
    return {
      statusText: "Error",
      status: "503",
      message: CircularJSON.stringify(error)
    };
  }
}

async function apiGetRanking() {
  return [];
}
async function apiGetPlayer(id) {
  return [];
}
async function apiGetPlayers() {
  const result = await axios.get(`${API_URL}/players`);
  return getData(result);
}

async function apiGetTournament(id) {
  const tournaments = await apiGetTournaments();
  const tournamentArray = tournaments.filter(
    ({ TurneringsId }) => TurneringsId == id
  );
  if (tournamentArray.length === 0) {
    return { noSuchTournament: "No such tournamentID" };
  }
  return tournamentArray[0];
}
async function apiGetTournaments() {
  const result = await axios.get(`${API_URL}/tournaments`);
  return getData(result);
}

async function apiGetNorwegianTournaments() {
  const tournaments = await apiGetTournaments();
  return tournaments.filter(({ Turneringstype }) =>
    norwegianTournamentsTypes.includes(Turneringstype)
  );
}

function getData(result) {
  if (result.status !== 200) {
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
  apiGetNorwegianTournaments,
  apiRegisterTeamForTournament
};
