const express = require("express");

import { getRanking, getPlayer, getTournament, getTournaments } from "./api";

const dev = process.env.NODE_ENV !== "production";
const next = require("next");
const pathMatch = require("path-match");
const app = next({ dev });
const handle = app.getRequestHandler();
const { parse } = require("url");

app.prepare().then(() => {
  const server = express();

  server.use("/api/ranking", async (req, res) => {
    const ranking = await getRanking();
    return res.json(ranking);
  });

  server.use("/api/tournaments", async (req, res) => {
    const ranking = await getTournaments();
    return res.json(ranking);
  });

  server.use("/api/players/:id", async (req, res) => {
    const ranking = await getPlayer(req.params.id);
    return res.json(ranking);
  });

  server.use("/api/tournament/:id", async (req, res) => {
    const ranking = await getTournament(req.params.id);
    return res.json(ranking);
  });

  server.get("/players/:id", (req, res) => {
    return app.render(req, res, "/player", { id: req.params.id });
  });

  server.get("/tournaments/", (req, res) => {
    return app.render(req, res, "/tournaments", {});
  });

  server.get("/tournaments/:id", (req, res) => {
    return app.render(req, res, "/tournament", {});
  });

  server.get("*", (req, res) => {
    return handle(req, res);
  });

  /* eslint-disable no-console */
  server.listen(process.env.PORT || 3000, err => {
    if (err) throw err;
    console.log("Server ready on http://localhost:3000");
  });
});
