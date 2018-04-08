require("dotenv").config();

const express = require("express");

const api = require("./api");
const {
  getRanking,
  getPlayer,
  getPlayers,
  getTournament,
  getTournaments,
  getNorwegianTournaments,
  registerTeamForTournament
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

const playerHandler = async (req, res) => {
  const ranking = await getPlayer(req.params.id);
  return res.json(ranking);
};

const tournamentHandler = async (req, res, next) => {
  log("tournamentHandler");
  const tournament = await getTournament(req.params.id);
  if (tournament.noSuchTournament) {
    log("noSuchTournament - going to next handler");
    return next();
  }
  return res.json(tournament);
};

const norwegianTournamentHandler = async (req, res) => {
  log("norwegianTournamentHandler");
  const norwegian = await getNorwegianTournaments();
  return res.json(norwegian);
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
    "/api/tournaments/norwegian",
    errorHandlerJson.bind(null, norwegianTournamentHandler)
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

  server.get("/client_token", async function(req, res) {
    res.send(await getClientToken());
  });

  server.get("/test", async function(req, res) {
    return res.send(
      CircularJSON.stringify(
        await registerTeamForTournament(1, "M", 2589669, 6328154, 12345)
      )
    );
  });

  server.use("/tournaments/checkout", checkoutRoute);

  checkoutRoute.post("/", async (req, res) => {
    const { tournamentId, player1, player2, klasse } = req.body;
    const nonce = "fake-valid-no-billing-address-nonce" || req.body.nonce;

    // 1. Checke om det er plass nok
    // 2. Sjekke om prisen er riktig
    const price = 500;
    const tournament = getTournament(tournamentId);

    console.log("Sending to braintree...");
    gateway.transaction.sale(
      {
        customer: {
          email: req.body.email
        },
        amount: price,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
          storeInVaultOnSuccess: true
        }
      },
      (err, result) => {
        console.log("Response from braintree", err, result);
        if (err || !result.success) {
          console.log("ERROR", err || result);
          return res.json({
            error: JSON.stringify(err || result, null, 2),
            status: "error"
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
          .then(apiRes => res.json(apiRes))
          .catch(err => res.status(503).json(CircularJSON.stringify(err)));

        // sendMailTournament(
        //   req.body.email,
        //   tournament,
        //   klasse,
        //   price,
        //   result.transaction.id
        // );
      }
    );
  });

  server.get("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(process.env.PORT || 3000, err => {
    if (err) throw err;
    log("Server ready on http://localhost:3000");
  });
});

async function errorHandlerJson(handler, req, res, next) {
  try {
    return await handler(req, res, next);
  } catch (err) {
    log(`Error in handler: ${err}`);
    res.status(500).json({
      error: "Internal Server Error",
      details: `${err}`
    });
  }
}
