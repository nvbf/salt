import React from "react";
import debug from "debug";
import Link from "next/link";
import fetch from "isomorphic-unfetch";
import Main from "../components/Main";

import { withStyles } from "material-ui/styles";
import withRoot from "../src/withRoot";
import { getTournaments } from "../src/api";
const CircularJSON = require("circular-json");

const log = debug("results");

class ResultsPage extends React.Component {
  constructor(props) {
    super(props);
    this.defaultState = { tournaments: [], errror: false, loading: true };
    this.retryGetRanking = this.retryGetRanking.bind(this);

    const {
      tournaments = this.defaultState.tournaments,
      error = this.defaultState.error,
      loading = this.defaultState.loading
    } = this.props;

    this.state = Object.assign({}, this.defaultState, {
      tournaments,
      error,
      loading
    });
  }

  async retryGetRanking() {
    this.setState(Object.assign({}, this.defaultState));
    //this.setState(await getResultsAsProps());
  }

  static async getInitialProps() {
    return await getResultsAsProps();
  }

  render() {
    const { tournaments = [], loading, error, errorDetails } = this.state;

    return (
      <Main
        error={error}
        loading={loading}
        errorDetails={errorDetails}
        retryHandler={this.retryGetRanking}
      >
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
          <Link href={"/tournament"} as={`/tournaments/${id}`}>
            <a>{name}</a>
          </Link>
        </td>
        {renderTableData(rest)}
      </tr>
    );
  });
}

function renderTableHead({ id, timestamp, ...rest }) {
  const keys = ["Navn", "Startdato", "Pameldingsfrist", "Klasser"];
  return (
    <thead>
      <tr>
        {keys.map(key => (
          <td key={key}>
            <strong>{key}</strong>
          </td>
        ))}
      </tr>
    </thead>
  );
}

function renderTableData(props) {
  const keys = ["startDate", "deadline", "classesText"];
  return keys.map(key => <td key={key}>{props[key]}</td>);
}

async function getResultsAsProps() {
  try {
    const json = await getTournaments();
    return { tournaments: json, loading: false };
  } catch (err) {
    log(err);
    return {
      loading: false,
      error: true,
      errorDetails: CircularJSON.stringify(err)
    };
  }
}

export default withRoot(withStyles({})(ResultsPage));
