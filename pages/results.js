import React from "react";
import debug from "debug";
import Link from "next/link";
import fetch from "isomorphic-unfetch";
import Main from "../components/Main";

const log = debug("tournaments");

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = { players: [], loading: true };
  }

  async componentDidMount() {
    const res = await fetch("/api/tournaments/finished");
    const statusCode = res.statusCode > 200 ? res.statusCode : false;
    const json = await res.json();

    this.setState({ tournaments: json, loading: false });
  }

  render() {
    const { tournaments = [], loading, error } = this.state;
    log(tournaments);
    if (error) {
      return (
       <Main>
          Noe feil skjedde :\ <p>{error}</p>
        </Main>
      );
    }
    if (loading) {
      return (
        <Main>
          Loading...
        </Main>
      );
    }
    return (
      <Main>
        {renderTournaments(tournaments)}
      </Main>
    );
  }
}

function renderTournaments(tournaments) {
  if (tournaments.length > 0) {
    return listTournaments(tournaments);
  }
  return <div>Ingen turneringer er på plass enda, prøve igjen senere</div>;
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
  return tournaments.map(({ id, name, ...rest }, key) => {
    return (
      <tr key={key}>
        <td>
          <Link href={"/tournament"} as={`/tournaments/${id}`}  >
            <a>{name}</a>
          </Link>
        </td>
        {renderTableData(rest)}
      </tr>
    );
  });
}

function renderTableHead({id, timestamp, ...rest, }) {
  const keys =  ["Navn", "Startdato", "Pameldingsfrist", "Klasser"];
  return (
    <thead>
      <tr>{keys.map(key => <td key={key}><strong>{key}</strong></td>)}</tr>
    </thead>
  );
}

function renderTableData(props) {
  const keys =  ["startDate", "deadline", "classesText"];
  return keys.map(key => <td key={key}>{props[key]}</td>);
}

