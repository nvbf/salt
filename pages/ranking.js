import React from "react";
import debug from "debug";
import Link from "next/link";
import fetch from "isomorphic-unfetch";
import Head from "../components/head";
import Nav from "../components/nav";

const log = debug("players");

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = { players: [], loading: true };
  }

  async componentDidMount() {
    const res = await fetch("/api/ranking");
    const statusCode = res.statusCode > 200 ? res.statusCode : false;
    const json = await res.json();

    this.setState({ players: json, loading: false });
  }

  render() {
    const { players = [], loading } = this.state;
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
        {renderPlayers(players)}
        <p>Trykk på spillerne for detalje side</p>
      </div>
    );
  }
}

function renderPlayers(players) {
  if (players.length > 1) {
    log("player is truthy");
    return <ul>{listTournaments(players)}</ul>;
  }
  log("player is falsy");
  return <div>Ingen spillere er registert</div>;
}

function listTournaments(players) {
  return players.map(({ id, name, points }, key) => {
    log(id, name, points);
    return (
      <li key={key}>
        <Link href={`/players/${id}`}>
          <span>
            {name} - {points}
          </span>
        </Link>
      </li>
    );
  });
}
