const {
  apiGetRanking,
  apiGetPlayer,
  apiGetPlayers,
  apiGetTournament,
  apiGetTournaments,
  apiGetTournamentsInTheFuture,
  apiGetTournamentsthatIsFinished,
  apiRegisterTeamForTournament,
  apiGetPointsFromPlayer,
  apiGetPoints
} = require("./json-api");

const { getJson } = require("../utils/getJson");

const log = require("debug")("salt:src:api");
const isServer = typeof window === "undefined";

async function getRanking() {
  if (!isServer) {
    return getJson("/api/ranking");
  }
  return await apiGetRanking();
}

async function getPointsFromPlayer(id) {
  if (!isServer) {
    return getJson(`/api/points/${id}`);
  }
  const points = await apiGetPointsFromPlayer(id);
  return mapToObjectv2(points);
}

async function getTournamentResults(tournamentId) {
  if (!isServer) {
    return getJson(`/api/tournaments/${tournamentId}/results`);
  }
  const points = await getPoints(tournamentId);
  const players = await getPlayers();
  const { classes } = await getTournament(tournamentId);

  const playersById = players.reduce((playersById, player) => {
    playersById[player.playerId] = player;
    return playersById;
  }, {});

  const tournamentResult = points.filter(({ id }) => id == tournamentId);
  if (tournamentResult.length === 0) {
    return [];
  }
  const classesResult = classes
    .filter(klasse => klasse.teams.length > 0)
    .map(klasse => {
      const teams = klasse.teams

        .map(team => {
          const res = tournamentResult.filter(
            res => res.playerId === team.player1Id
          );
          if (res.length === 0) {
            return {};
          }
          return Object.assign(
            {},
            {
              teamNameShort: team.teamNameShort,
              place: res[0].place,
              points: res[0].points
            }
          );
        })
        .sort((a, b) => a.place - b.place);

      return {
        class: klasse.teams[0]["klasse"],
        teams
      };
    });

  return classesResult;
}

async function getPoints(id) {
  if (!isServer) {
    return getJson(`/api/points`);
  }
  const points = await apiGetPoints();
  return mapToObjectv2(points);
}

async function getPlayer(id) {
  if (!isServer) {
    return getJson(`/api/players/${id}`);
  }
  const player = await apiGetPlayer(id);
  return mapToObjectv2(player);
}

async function getPlayers() {
  if (!isServer) {
    return getJson(`/api/players`);
  }
  const apiPlayers = await apiGetPlayers();
  const players = mapToObjectv2(apiPlayers);
  const simplePlayers = players.map(
    ({ playerId, firstname, lastname, gender }) => ({
      playerId,
      firstname,
      lastname,
      gender
    })
  );
  return simplePlayers.filter(({ playerId }) => playerId != 0);
}

async function getTournament(id) {
  if (!isServer) {
    return getJson(`/api/tournaments/${id}`);
  }
  const apiTournament = await apiGetTournament(id);
  return mapToObjectv2(apiTournament);
}

async function getTournaments() {
  if (!isServer) {
    return getJson(`/api/tournaments/`);
  }
  const tournaments = await apiGetTournaments();
  return mapToObjectv2(tournaments);
}

async function getTournamentsThatHasEnded() {
  if (!isServer) {
    return getJson(`/api/tournaments/finished`);
  }
  const tournamentsThatIsEnded = await apiGetTournamentsthatIsFinished();
  return tournamentsThatIsEnded;
}

async function getTournamentsInTheFuture() {
  if (!isServer) {
    return getJson(`/api/tournaments/future`);
  }
  const tournamentsInTheFuture = await apiGetTournamentsInTheFuture();

  return tournamentsInTheFuture;
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
    Melding: "",
    TransactionId: transactionId
  });
  return response;
}

function mapToObjectv2(apiRes) {
  if (Array.isArray(apiRes)) {
    return apiRes.map(obj => mapToObjectv2(obj));
  }
  if (apiRes === null) {
    return "";
  }
  const keys = Object.keys(apiRes);
  let tournament = {};
  keys.forEach(key => {
    if (mappingNew[key]) {
      if (typeof apiRes[key] === "object") {
        const result = mapToObjectv2(apiRes[key]);
        tournament[mappingNew[key]] = result;
      } else {
        tournament[mappingNew[key]] = apiRes[key];
      }
    } else {
      log(`skipping ${key} no mapping for it! (v2)`);
    }
  });
  return tournament;
}

function mapToObject(apiRes) {
  if (Array.isArray(apiRes)) {
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
  StartDato: "startDate",
  Starttid: "startTime",
  Sluttid: "endTime",
  Pameldingsfrist: "deadline",
  Turneringsleder: "tournamentDirector",
  TurneringEpost: "email",
  Telefon: "phone",
  TurneringTlf: "phone",
  KlasserTekst: "classesText",
  Klasser: "classes",
  Klasse: "klasse",
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
  teamName: "teamName",
  LagnavnKort: "teamNameShort",
  Spiller_1: "player1Id",
  Spiller_2: "player2Id",
  PoengS1: "player1Points",
  PoengS2: "player2Points",
  PoengLag: "teamPoints",
  ProfixioId: "profixioId",
  Idrettsnr: "idrettsnr",
  SpillerId: "playerId",
  Kjonn: "gender",
  Turneringsnavn: "tournamentName",
  Plassering: "place",
  Poeng: "points",
  Topn: "topn",
  SortId: "sortId",
  Foreldet: "obsolete"
};

const mappingNew = {
  classes: "classes",
  teams: "teams",
  klasse: "klasse",
  maxNrOfTeams: "maxNrOfTeams",
  price: "price",
  tournamentId: "tournamentId",
  TurneringsId: "tournamentId",
  name: "name",
  tournamentType: "tournamentType",
  Turneringstype: "tournamentType",
  Sesong: "season",
  season: "season",
  endDate: "endDate",
  Finaledato: "endDate",
  tournamentIdProfixio: "tournamentIdProfixio",
  shortNameProfixio: "shortNameProfixio",
  startDate: "startDate",
  Starttid: "startTime",
  endTime: "endTime",
  deadline: "deadline",
  tournamentDirector: "tournamentDirector",
  mail: "email",
  phone: "phone",
  TurneringTlf: "phone",
  classesAsText: "classesAsText",
  Klasser: "classes",
  Klasse: "klasse",
  Pris: "price",
  MaksLag: "maxNrOfTeams",
  description: "description",
  playerVenue: "playerVenue",
  paymentInfo: "paymentInfo",
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
  SpillerId: "playerId",
  Kjonn: "gender",
  Turneringsnavn: "tournamentName",
  Plassering: "place",
  Poeng: "points",
  Topn: "topn",
  SortId: "sortId",
  Foreldet: "obsolete",
  organizer: "organizer",
  region: "region"
};

module.exports = {
  getRanking,
  getPlayer,
  getPlayers,
  getTournament,
  getTournaments,
  registerTeamForTournament,
  getPointsFromPlayer,
  getTournamentsInTheFuture,
  getTournamentsThatHasEnded,
  getPoints,
  getTournamentResults
};
