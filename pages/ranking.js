import React from "react";
import debug from "debug";
import Link from "next/link";
import fetch from "isomorphic-unfetch";
import Head from "../components/head";
import Nav from "../components/nav";
import { LoadingPage } from "../components/loading-page";
import { ErrorPage } from "../components/error-page";
import { getJson } from "../src/utils/getJson";

const log = debug("players");

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = { players: [], loading: true };
  }

  async componentDidMount() {
    this.setState({ players: await getJson("/api/ranking"), loading: false });
  }

  render() {
    const { players = [], loading, error } = this.state;
    if (loading) return <LoadingPage />;
    if (error) return <ErrorPage error={error} />;

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
  return players.map(({ id, name, sum }, key) => {
    log(id, name, sum);
    return (
      <li key={key}>
        <Link href={`/players/${id}`}>
          <a>
            {name} - {sum}
          </a>
        </Link>
      </li>
    );
  });
}
