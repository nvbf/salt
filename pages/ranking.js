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
    this.state = { male: [], female: [], loading: true };
  }

  async componentDidMount() {
    const { male, female } = await getJson("/api/ranking");
    this.setState({ male, female, loading: false });
  }

  render() {
    const { male = [], female = [], loading, error } = this.state;
    if (loading) return <LoadingPage />;
    if (error) return <ErrorPage error={error} />;

    return (
      <div>
        <Head title="Home" />
        <Nav />
        <h3>Damer</h3>
        {renderPlayers(female)}
        <h3>Herrer</h3>
        {renderPlayers(male)}
      </div>
    );
  }
}

function renderPlayers(players) {
  if (players.length > 1) {
    return <ul>{listTournaments(players)}</ul>;
  }
  return <div>Ingen spillere er registert</div>;
}

function listTournaments(players) {
  return players.map(({ id, name, sum }, key) => {
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
