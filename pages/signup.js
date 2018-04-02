import React from "react";
import debug from "debug";
import Link from "next/link";
import fetch from "isomorphic-unfetch";
import Head from "../components/head";
import Nav from "../components/nav";
import { getIdFromPath } from "../src/utils/getIdFromPath";
import { getJson } from "../src/utils/getJson";

const log = debug("players");

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = { players: [], tournament: {}, loading: true };
  }

  async componentDidMount() {
    try {
      const id = getIdFromPath();
      const res = getJson("/api/players");
      const tournament = getJson(`/api/tournaments/${id}`);
      this.setState({ players: json, tournament: tournament, loading: false });
    } catch (err) {
      this.setState({ error: "Problem..." });
    }
  }

  render() {
    const { players, tournament, loading } = this.state;
    log("tournament", tournament);
    if (loading) {
      return (
        <div>
          <Head title="Home" />
          <Nav />
          Loading...
        </div>
      );
    }
    return (
      <div>
        <Head title="Home" />
        <Nav />
        <h1> {tournament.name}</h1>
        {renderSignup(players, tournament)}
      </div>
    );
  }
}

function renderSignup(players) {
  if (players.length > 1) {
    log("player is truthy");
    return <select>{listPlayers(players)}</select>;
  }
  log("player is falsy");
  return <div>Ingen spillere er registert</div>;
}

function listPlayers(players) {
  return players.map(({ name }, index) => {
    return <option key={index}>{name}</option>;
  });
}
