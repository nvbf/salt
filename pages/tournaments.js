import React from "react";
import debug from "debug";
import Link from "next/link";
import fetch from "isomorphic-unfetch";
import Head from "../components/head";
import Nav from "../components/nav";

const log = debug("tournaments");

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = { players: [], loading: true };
  }

  async componentDidMount() {
    const res = await fetch("/api/tournaments/norwegian");
    const statusCode = res.statusCode > 200 ? res.statusCode : false;
    const json = await res.json();

    this.setState({ tournaments: json, loading: false });
  }

  render() {
    const { tournaments = [], loading, error } = this.state;
    log(tournaments);
    if (error) {
      return (
        <div>
          <Head title="Home" />
          <Nav />
          Noe feil skjedde :\ <p>{error}</p>
        </div>
      );
    }
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
      </div>
    );
  }
}

function renderTournaments(tournaments) {
  if (tournaments.length > 0) {
    return listTournaments(tournaments);
  }
  return <div>Ingen turneringer er registert</div>;
}

function listTournaments(tournaments) {
  return (
    <table>
      {renderTableHead(tournaments[0])}
      <tbody>{listRow(tournaments)}</tbody>
    </table>
  );
}

function listRow(tournaments) {
  return tournaments.map(({ TurneringsId, Navn, ...rest }, key) => {
    return (
      <tr key={key}>
        <td>
          <Link href={"/tournament"} as={`/tournaments/${TurneringsId}`}  >
            <a>{Navn}</a>
          </Link>
        </td>
        {renderTableData(rest)}
      </tr>
    );
  });
}

function renderTableHead({id, timestamp, ...rest, }) {
  const keys =  ["Name", "Startdato", "Pameldingsfrist", "KlasserTekst"];
  return (
    <thead>
      <tr>{keys.map(key => <td key={key}><strong>{key}</strong></td>)}</tr>
    </thead>
  );
}

function renderTableData(props) {
  const keys =  ["Startdato", "Pameldingsfrist", "KlasserTekst"];
  return keys.map(key => <td key={key}>{props[key]}</td>);
}

