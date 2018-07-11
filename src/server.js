require("dotenv").config();
const express = require("express");

/* eslint-disable import/first */
import { rollbar } from "./utils/rollbar";
import { getTournamentClass } from "./utils/getTournamentClass";

const api = require("./api");
const {
  getRanking,
  getPlayer,
  getPlayers,
  getTournament,
  getTournaments,
  registerTeamForTournament,
  getPointsFromPlayer,
  getTournamentsInTheFuture,
  getPoints,
  getTournamentResults,
  getTournamentsThatHasEnded
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

var routeCache = require("route-cache");

const getRankingHandler = async (req, res) => {
  const ranking = await getRanking();
  return res.json(ranking);
};

const getPointsHandler = async (req, res) => {
  const ranking = await getPoints();
  return res.json(ranking);
};

const tournamentsHandler = async (req, res) => {
  const ranking = await getTournaments();
  return res.json(ranking);
};

const tournamentResultHandler = async (req, res) => {
  const ranking = await getTournamentResults(req.params.id);
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

const tournamentsThatHasEndedHandler = async (req, res) => {
  return res.json(await getTournamentsThatHasEnded());
};

const tournamentHandler = async (req, res, next) => {
  const tournament = await getTournament(req.params.id);
  if (tournament.noSuchTournament) {
    return res.status(404).send("404");
  }
  return res.json(tournament);
};

app.prepare().then(() => {
  const server = express();
  server.use(rollbar.errorHandler());
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

  server.get(
    "/api/ranking",
    routeCache.cacheSeconds(600),
    errorHandlerJson.bind(null, getRankingHandler)
  );

  server.get(
    "/api/tournaments/future",
    routeCache.cacheSeconds(300),
    errorHandlerJson.bind(null, tournamentsInTheFutureHandler)
  );

  server.get(
    "/api/tournaments/finished",
    routeCache.cacheSeconds(300),
    errorHandlerJson.bind(null, tournamentsThatHasEndedHandler)
  );

  server.get(
    "/api/points/",
    routeCache.cacheSeconds(300),
    errorHandlerJson.bind(null, getPointsHandler)
  );

  server.get(
    "/api/tournaments/:id",
    routeCache.cacheSeconds(30),
    errorHandlerJson.bind(null, tournamentHandler)
  );

  server.get(
    "/api/tournaments/:id/results",
    routeCache.cacheSeconds(410),
    errorHandlerJson.bind(null, tournamentResultHandler)
  );

  server.get(
    "/api/tournaments",
    routeCache.cacheSeconds(400),
    errorHandlerJson.bind(null, tournamentsHandler)
  );

  server.get(
    "/api/points/:id",
    routeCache.cacheSeconds(300),
    errorHandlerJson.bind(null, pointsHandler)
  );

  server.get(
    "/api/players/:id",
    routeCache.cacheSeconds(400),
    errorHandlerJson.bind(null, playerHandler)
  );

  server.get(
    "/api/players/",
    routeCache.cacheSeconds(450),
    errorHandlerJson.bind(null, playersHandler)
  );

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
    const { tournamentId, player1, player2, klasse, email } = req.body;
    if (!tournamentId || !player1 || !player2 || !klasse) {
      log(
        `ERROR: POST data is incorrect?  ${tournamentId} ${player1} ${player2} ${klasse}`
      );
      return res.json({
        error: `Forventet at tournament, player1, player2 and klasse had a value: ${tournamentId}, ${player1}, ${player2}, ${klasse}`,
        statusText: "error"
      });
    }

    log(
      `SIGNUP: tournamentId:${tournamentId} klasse: ${klasse} player1:${player1} player2:${player2} email:${email}`
    );

    const nonce = process.env.BT_SANDBOX
      ? "fake-valid-no-billing-address-nonce"
      : req.body.nonce;

    const tournament = await getTournament(tournamentId);

    const tournamentClass = getTournamentClass(tournament, klasse);
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

    if (price !== 0) {
      gateway.transaction.sale(salesData, (err, result) => {
        log("Response from braintree", err, result);
        if (err || !result.success) {
          log("ERROR", err || result);
          return res.json({
            error:
              "Kunne ikke ta betalt, dette kan skyldes så meget. F.eks du har tastet feil kortnummer eller man har ikke penger på kortet. Prøv igjen eller gi opp",
            statusText: "error"
          });
        }
        registerTeamForTournament(
          tournamentId,
          klasse,
          player1,
          player2,
          result.transaction.id,
          req.body.email
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
            log(
              `ERROR: Was not able to registere the team, but payment is done! ${CircularJSON.stringify(
                err
              )}`
            );

            res.status(503).json({
              error:
                "Betalingen er registert, men en feil oppstod når vi skulle legge det til i turneringen. Dette skal ikke skje, men er rapportert. " +
                "Forhåpentligvis fikser vi dette manuelt i ettertid. Sjekk om du er registert om 2 timer, hvis ikke send mail til post@osvb.no",
              statusText: "error"
            });
          });

        sendMailTournament(
          req.body.email,
          tournament,
          klasse,
          price,
          result.transaction.id
        );
      });
    } else {
      registerTeamForTournament(
        tournamentId,
        klasse,
        player1,
        player2,
        "påmeldt til en turnering med pris 0"
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
          log(
            `ERROR: Was not able to registere the team, Påmeldingen var gratis ${CircularJSON.stringify(
              err
            )}`
          );

          res.status(503).json({
            error:
              "En feil oppstod når vi skulle legge det til i turneringen. Dette skal ikke skje, men feilen er rapportert. " +
              "Prøv igjen om 5 min.",
            statusText: "error"
          });
        });

      sendMailTournament(req.body.email, tournament, klasse, false, false);
    }
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

process.on("unhandledRejection", reason => {
  rollbar.error("unhandledRejection", reason);
  process.exit(-1);
});
