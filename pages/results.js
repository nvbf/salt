import React from "react";
import debug from "debug";
import Link from "next/link";
import fetch from "isomorphic-unfetch";
import Main from "../components/Main";

import { withStyles } from 'material-ui/styles';
import withRoot from "../src/withRoot";
import { getJson } from "../src/utils/getJson";
const CircularJSON = require("circular-json");

const log = debug("tournaments");

class ResultsPage extends React.Component {
  constructor(props) {
    super(props);

    this.getTournaments = this.getTournaments.bind(this);

    this.defaultState = { players: [], errror: false, loading: true };
    this.state = Object.assign({}, this.defaultState);
  }

  async getTournaments() {
    this.setState(this.defaultState);
    try {
      const json = await getJson("/api/tournaments/future");
      this.setState({ tournaments: json, loading: false });
    } catch (err) {
      this.setState({
        loading: false,
        error: true,
        errorDetails: CircularJSON.stringify(err)
      });
    }
  }
  async componentDidMount() {
    const res = await fetch("/api/tournaments/finished");
    const statusCode = res.statusCode > 200 ? res.statusCode : false;
    const json = await res.json();

    this.setState({ tournaments: json, loading: false });
  }

  render() {
    const { tournaments = [], loading, error, errorDetails } = this.state;
  
    return (
      <Main error loading errorDetails={errorDetails} >
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

export default withRoot(withStyles({})(ResultsPage));