const {
  apiGetRanking,
  apiGetPlayer,
  apiGetPlayers,
  apiGetTournament,
  apiGetTournaments,
  apiGetNorwegianTournaments,
  apiRegisterTeamForTournament
} = require("./json-api");

const log = require("debug")("salt:src:api");

async function getRanking() {
  return await apiGetRanking();
}

async function getPlayer(id) {
  return await apiGetPlayer(id);
}

async function getPlayers() {
  const apiPlayers = await apiGetPlayers();
  const players = mapToObject(apiPlayers);
  const simplePlayers = players.map(({ id, firstname, lastname }) => ({
    id,
    firstname,
    lastname
  }));
  return simplePlayers.filter(({ id }) => id != 0);
}

async function getTournament(id) {
  const apiTournament = await apiGetTournament(id);
  return mapToObject(apiTournament);
}

async function getTournaments() {
  return await apiGetTournaments();
}

async function getNorwegianTournaments() {
  return await apiGetNorwegianTournaments();
}

async function registerTeamForTournament(
  tournamentId,
  klasse,
  player1,
  player2,
  transactionId
) {
  log(
    JSON.stringify({
      tournamentId,
      klasse,
      player1,
      player2,
      transactionId
    })
  );
  const response = await apiRegisterTeamForTournament({
    TurneringsId: tournamentId,
    Spiller_1: player1,
    Spiller_2: player2,
    Klasse: klasse,
    Melding: "TODO: få sendt inn transactionId"
  });
  return response;
}

function mapToObject(apiRes) {
  if (Array.isArray(apiRes)) {
    log(`mapping Array`);
    return apiRes.map(obj => mapToObject(obj));
  }

  const keys = Object.keys(apiRes);
  let tournament = {};
  keys.forEach(key => {
    if (mapping[key]) {
      if (typeof apiRes[key] === "object") {
        const result = mapToObject(apiRes[key]);
        tournament[mapping[key]] = result;
      } else {
        tournament[mapping[key]] = apiRes[key];
      }
    } else {
    }
  });
  return tournament;
}

const mapping = {
  TurneringsId: "id",
  Navn: "name",
  Turneringstype: "tournamentType",
  Sesong: "season",
  Finaledato: "endDate",
  TurneringsIdProfixio: "tournamentIdProfixio",
  KortnavnProfixio: "shortNameProfixio",
  Startdato: "startDate",
  Starttid: "startTime",
  Sluttid: "endTime",
  Pameldingsfrist: "deadline",
  Turneringsleder: "tournamentDirector",
  TurneringEpost: "email",
  Telefon: "phone",
  TurneringTlf: "phone",
  KlasserTekst: "classesText",
  Klasser: "classes",
  Klasse: "class",
  Pris: "price",
  MaksLag: "maxNrOfTeams",
  Memo: "description",
  Spillested: "playerVenue",
  Betalingsinfo: "paymentInfo",
  PersonId: "id",
  Fornavn: "firstname",
  Etternavn: "lastname",
  Adresse1: "adresseLine1",
  Adresse2: "adresseLine2",
  Posnr: "zipcode",
  Possted: "city",
  FDato: "dateOfBith",
  Epost: "email"
};

module.exports = {
  getRanking,
  getPlayer,
  getPlayers,
  getTournament,
  getTournaments,
  getNorwegianTournaments,
  registerTeamForTournament
};
