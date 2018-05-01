const moment = require("moment");

const {
  apiGetRanking,
  apiGetPlayer,
  apiGetPlayers,
  apiGetTournament,
  apiGetTournaments,
  apiGetNorwegianTournaments,
  apiRegisterTeamForTournament,
  apiGetPointsFromPlayer
} = require("./json-api");

const log = require("debug")("salt:src:api");

async function getRanking() {
  return await apiGetRanking();
}

async function getPointsFromPlayer(id) {
  const points = await apiGetPointsFromPlayer(id);
  return mapToObject(points);
}

async function getPlayer(id) {
  const player = await apiGetPlayer(id);
  return mapToObject(player);
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
  const tournaments = await apiGetTournaments();
  return mapToObject(tournaments);
}

async function getTournamentsInTheFuture() {
  const tournaments = await getTournaments();
  const tournamentsInTheFuture = tournaments.filter(({ deadline }) => {
    const timeToDeadLine = moment(deadline, "DD.MM.YYYY").diff(moment.now());
    return timeToDeadLine > 0;
  });
  return tournamentsInTheFuture;
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
    Melding: "TODO: få sendt inn transactionId",
    TransactionId: 4
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
      log(`skipping ${key} no mapping for it!`);
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
  PersonId: "personId",
  Fornavn: "firstname",
  Etternavn: "lastname",
  Adresse1: "adresseLine1",
  Adresse2: "adresseLine2",
  Posnr: "zipcode",
  Possted: "city",
  FDato: "dateOfBith",
  Epost: "email",
  Lag: "teams",
  LagId: "teamId",
  Lagnavn: "teamName",
  LagnavnKort: "teamNameShort",
  Spiller_1: "player1Id",
  Spiller_2: "player2Id",
  PoengS1: "player1Points",
  PoengS2: "player2Points",
  PoengLag: "teamPoints",
  ProfixioId: "profixioId",
  Idrettsnr: "idrettsnr",
  SpillerId: "id",
  Kjonn: "gender",
  Turneringsnavn: "tournamentName",
  Plassering: "place",
  Poeng: "points",
  Topn: "topn",
  SortId: "sortId",
  Foreldet: "obsolete"
};

module.exports = {
  getRanking,
  getPlayer,
  getPlayers,
  getTournament,
  getTournaments,
  getNorwegianTournaments,
  registerTeamForTournament,
  getPointsFromPlayer,
  getTournamentsInTheFuture
};
