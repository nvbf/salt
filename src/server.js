require('dotenv').config()

const express = require("express");
const api = require("./api");
const {
  getRanking,
  getPlayer,
  getPlayers,
  getTournament,
  getTournaments,
  getNorwegianTournaments
} = api;

const dev = process.env.NODE_ENV !== "production";
const next = require("next");
const pathMatch = require("path-match");
const app = next({ dev });
const handle = app.getRequestHandler();
const { parse } = require("url");
const log = require('debug')('salt:server')
const CircularJSON = require('circular-json')


const getRankingHandler = async (req, res) => {
  const ranking = await getRanking();
  return res.json(ranking);
};

const tournamentsHandler = async (req, res) => {
  const ranking = await getTournaments();
  return res.json(ranking);
};

const playersHandler = async (req, res) => {
  const players = await getPlayers();
  return res.json(players);
};

const playerHandler = async (req, res) => {
  const ranking = await getPlayer(req.params.id);
  return res.json(ranking);
};

const tournamentHandler = async (req, res, next) => {
  log("tournamentHandler")
  const tournament = await getTournament(req.params.id);
  if(tournament.noSuchTournament) {
    log('noSuchTournament - going to next handler')
    return next() 
  }
  return res.json(tournament);
};

const norwegianTournamentHandler = async (req, res) => {
  log('norwegianTournamentHandler')
  const norwegian = await getNorwegianTournaments();
  return res.json(norwegian);
};

app.prepare().then(() => {
  const server = express();

  server.use("/api/ranking", errorHandlerJson.bind(null, getRankingHandler));

  server.use(
    '/api/tournaments/norwegian', errorHandlerJson.bind(null, norwegianTournamentHandler)
  );

  server.use(
    "/api/tournaments/:id",
    errorHandlerJson.bind(null, tournamentHandler)
  );

  server.use(
    "/api/tournaments",
    errorHandlerJson.bind(null, tournamentsHandler)
  );

  server.use("/api/players/", errorHandlerJson.bind(null, playersHandler));

  server.use("/api/players/:id", errorHandlerJson.bind(null, playerHandler));

  server.get("/players/:id", (req, res) => {
    return app.render(req, res, "/player", { id: req.params.id });
  });

  server.get("/tournaments/", (req, res) => {
    return app.render(req, res, "/tournaments", {});
  });

  server.get("/tournaments/:id", (req, res) => {
    return app.render(req, res, "/tournament", {});
  });

  server.get("/signup/:id", (req, res) => {
    return app.render(req, res, "/signup", {});
  });

  server.get("*", (req, res) => {
    return handle(req, res);
  });

  /* eslint-disable no-console */
  server.listen(process.env.PORT || 3000, err => {
    if (err) throw err;
    log("Server ready on http://localhost:3000");
  });
});

async function errorHandlerJson(handler, req, res, next) {
  try {
    return await handler(req, res, next);
  } catch (err) {
    log(`Error in handler: ${err}`)
    res.status(500).json({
      error: "Internal Server Error",
      details: `${err}`
    });
  }
}

