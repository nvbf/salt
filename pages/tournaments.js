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
    const res = await fetch("/api/tournaments");
    const statusCode = res.statusCode > 200 ? res.statusCode : false;
    const json = await res.json();

    this.setState({ tournaments: json, loading: false });
  }

  render() {
    const { tournaments = [], loading } = this.state;
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
        {renderTournaments(tournaments)}
        <p>Trykk på turneringa for detalje side</p>
      </div>
    );
  }
}

function renderTournaments(tournaments) {
  if (tournaments.length > 1) {
    return <table>{listTournaments(tournaments)}</table>;
  }
  return <div>Ingen turneringer er registert</div>;
}

function listTournaments(tournaments) {
  return tournaments.map(({ id, name, place, startdate }, key) => {
    return (
      <tr key={key}>
        <Link href={`/tournaments/${id}`}>
          <a>
            {id}, {name}, {place}, {startdate}
          </a>
        </Link>
      </tr>
    );
  });
}
