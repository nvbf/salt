const moment = require("moment");

const {
  apiGetRanking,
  apiGetPlayer,
  apiGetPlayers,
  apiGetTournament,
  apiGetTournaments,
  apiRegisterTeamForTournament,
  apiGetPointsFromPlayer,
  apiGetPoints
} = require("./json-api");

const { getJson } = require("../utils/getJson");

const log = require("debug")("salt:src:api");
const isServer = typeof window === "undefined";

async function getRanking(klasse) {
  if (!isServer) {
    return getJson(`/api/ranking/${klasse}`);
  }
  return await apiGetRanking(klasse);
}

async function getPointsFromPlayer(id) {
  if (!isServer) {
    return getJson(`/api/points/${id}`);
  }
  const points = await apiGetPointsFromPlayer(id);
  return mapToObject(points);
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
        class: klasse.teams[0]["class"],
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
  return mapToObject(points);
}

async function getPlayer(id) {
  if (!isServer) {
    return getJson(`/api/players/${id}`);
  }
  const player = await apiGetPlayer(id);
  return mapToObject(player);
}

async function getPlayers(klasse) {
  if (!isServer) {
    return getJson(`/api/players/class/:${klasse}`);
  }
  const apiPlayers = await apiGetPlayers(klasse);
  const players = mapToObject(apiPlayers);
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
  return mapToObject(apiTournament);
}

async function getTournaments() {
  if (!isServer) {
    return getJson(`/api/tournaments/`);
  }
  const tournaments = await apiGetTournaments();
  return mapToObject(tournaments);
}

async function getTournamentsThatHasEnded() {
  if (!isServer) {
    return getJson(`/api/tournaments/ended`);
  }
  const tournaments = await getTournaments();
  const tournamentsThatIsEnded = tournaments
    .filter(({ name, endDate }) => {
      const timeToEnd = moment(endDate, "DD.MM.YYYY")
        .endOf("day")
        .diff(moment.now());
      console.log(name, timeToEnd);
      return timeToEnd < 0;
    })
    .sort((a, b) => {
      return (
        moment(b.startDate, "DD.MM.YYYY") - moment(a.startDate, "DD.MM.YYYY")
      );
    });
  return tournamentsThatIsEnded;
}

async function getTournamentsInTheFuture() {
  if (!isServer) {
    return getJson(`/api/tournaments/future`);
  }
  const tournaments = await getTournaments();
  const tournamentsInTheFuture = tournaments
    .filter(({ endDate }) => {
      const timeToEnd = moment(endDate, "DD.MM.YYYY")
        .endOf("day")
        .diff(moment.now());
      return timeToEnd > 0;
    })
    .sort((a, b) => {
      return (
        moment(a.startDate, "DD.MM.YYYY") - moment(b.startDate, "DD.MM.YYYY")
      );
    });
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

function mapToObject(apiRes) {
  if (Array.isArray(apiRes)) {
    return apiRes.map(obj => mapToObject(obj));
  }
  console.log("apiRes", apiRes);
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
  SpillerId: "playerId",
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
  registerTeamForTournament,
  getPointsFromPlayer,
  getTournamentsInTheFuture,
  getTournamentsThatHasEnded,
  getPoints,
  getTournamentResults
};
