require("dotenv").config();
var Rollbar = require("rollbar");
var rollbar = new Rollbar(process.env.ROLLBAR_API_KEY);

const express = require("express");

const api = require("./api");
const {
  getRanking,
  getPlayer,
  getPlayers,
  getTournament,
  getTournaments,
  getNorwegianTournaments,
  registerTeamForTournament,
  getPointsFromPlayer,
  getTournamentsInTheFuture
} = api;

const getClientToken = require("./utils/getClientToken");
const gateway = require("./utils/gateway");
const sendMailTournament = require("./utils/sendMail");

const dev = process.env.NODE_ENV !== "production";
const next = require("next");
const pathMatch = require("path-match");
const app = next({ dev });
const handle = app.getRequestHandler();
const { parse } = require("url");
const log = require("debug")("salt:server");
const CircularJSON = require("circular-json");
const fetch = require("isomorphic-unfetch");

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

const pointsHandler = async (req, res) => {
  const rankingpoints = await getPointsFromPlayer(req.params.id);
  return res.json(rankingpoints);
};

const playerHandler = async (req, res) => {
  const player = await getPlayer(req.params.id);
  if (player.noSuchPlayer) {
    log("noSuchPlayer - going to next handler");
    return next();
  }
  return res.json(player);
};

const tournamentsInTheFutureHandler = async (req, res) => {
  return res.json(await getTournamentsInTheFuture());
};

const tournamentHandler = async (req, res, next) => {
  log("tournamentHandler");
  const tournament = await getTournament(req.params.id);
  if (tournament.noSuchTournament) {
    return res.status(404).end("404");
  }
  return res.json(tournament);
};

app.prepare().then(() => {
  const server = express();
  var checkoutRoute = express.Router();
  checkoutRoute.use(express.json());

  server.use((req, res, next) => {
    if (
      req.header("x-forwarded-proto") &&
      req.header("x-forwarded-proto") !== "https"
    ) {
      res.redirect(`https://${req.header("host")}${req.url}`);
    } else {
      next();
    }
  });

  server.use("/api/ranking", errorHandlerJson.bind(null, getRankingHandler));

  server.use(
    "/api/tournaments/future",
    errorHandlerJson.bind(null, tournamentsInTheFutureHandler)
  );

  server.use(
    "/api/tournaments/:id",
    errorHandlerJson.bind(null, tournamentHandler)
  );

  server.use(
    "/api/tournaments",
    errorHandlerJson.bind(null, tournamentsHandler)
  );

  server.use(
    "/api/tournaments",
    errorHandlerJson.bind(null, tournamentsHandler)
  );

  server.use("/api/points/:id", errorHandlerJson.bind(null, pointsHandler));

  server.use("/api/players/:id", errorHandlerJson.bind(null, playerHandler));

  server.use("/api/players/", errorHandlerJson.bind(null, playersHandler));

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

  server.get("/client_token", async function(req, res) {
    res.send(await getClientToken());
  });

  server.use("/tournaments/checkout", checkoutRoute);

  checkoutRoute.post("/", async (req, res) => {
    const { tournamentId, player1, player2, klasse } = req.body;
    if (!tournamentId || !player1 || !player2 || !klasse) {
      return res.json({
        error: `Forventet at tournament, player1, player2 and klasse had a value: ${tournamentId}, ${player1}, ${player2}, ${klasse}`,
        statusText: "error"
      });
    }
    const nonce = process.env.BT_SANDBOX
      ? "fake-valid-no-billing-address-nonce"
      : req.body.nonce;
    log(`Using nounce: ${nonce}`);

    // 1. Checke om det er plass nok

    // 2. Sjekke om prisen er riktig
    const tournament = await getTournament(tournamentId);
    log("tournament!!!", tournament);
    log(`find klasse ${klasse}`);
    //TODO: can't get correct class
    const tournamentClasses = tournament.classes.filter(
      klass => klass["class"] == klasse
    );
    const tournamentClass = tournamentClasses[0];
    log("tournament class", tournamentClass);
    const price = tournamentClass.price;

    if (tournamentClass.length === 0) {
      return res.json({
        error:
          "Can ikke finne denne klassen i denne turnering, dette skal ikke skje....",
        statusText: "error"
      });
    }

    if (tournamentClass.maxNrOfTeams <= tournamentClass.teams.length) {
      return res.json({
        error:
          "Turneringen ble dessverre akkurat full, det er ikke lenger mulig å melde seg på. Kortet har ikke blitt belastet",
        statusText: "error"
      });
    }

    console.log("Sending to braintree...");
    const salesData = {
      customer: {
        email: req.body.email
      },
      amount: price,
      paymentMethodNonce: nonce,
      options: {
        submitForSettlement: true,
        storeInVaultOnSuccess: true
      }
    };
    log(`salesData ${JSON.stringify(salesData)}`);
    gateway.transaction.sale(salesData, (err, result) => {
      console.log("Response from braintree", err, result);
      if (err || !result.success) {
        console.log("ERROR", err || result);
        return res.json({
          error: JSON.stringify(err || result, null, 2),
          statusText: "error"
        });
      }
      console.log(result.transaction);
      registerTeamForTournament(
        tournamentId,
        klasse,
        player1,
        player2,
        result.transaction.id
      )
        .then(apiRes => {
          const withPaymentStatus = Object.assign(
            {},
            { statusText: "OK" },
            apiRes
          );
          res.json(withPaymentStatus);
        })
        .catch(err => {
          log("Was not able to registere the team, but payment is done!");

          res.status(503).json(CircularJSON.stringify(err));
        });

      sendMailTournament(
        req.body.email,
        tournament,
        klasse,
        price,
        result.transaction.id
      );
    });
  });

  server.get("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(process.env.PORT || 3000, err => {
    if (err) throw err;
    log("Server ready on http://localhost:" + (process.env.PORT || 3000));
    rollbar.info(`Server starts on port ${process.env.PORT || 3000}`);
  });
});

async function errorHandlerJson(handler, req, res, next) {
  try {
    return await handler(req, res, next);
  } catch (err) {
    rollbar.error(err);
    log(`Error in handler: ${err}, ${CircularJSON.stringify(err)}`);
    res.status(500).json({
      error: "Internal Server Error",
      details: `${err}`
    });
  }
}
