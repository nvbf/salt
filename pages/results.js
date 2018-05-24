import React from "react";
import debug from "debug";
import Link from "next/link";
import fetch from "isomorphic-unfetch";
import Main from "../components/Main";

import { withStyles } from "@material-ui/core/styles";
import withRoot from "../src/withRoot";
import { getTournamentsThatIsEnded } from "../src/api";
import { TournamentList } from "../components/TournamentList";
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
    const retry = async () => {
      this.setState(await getResultsAsProps());
    };
    this.setState(Object.assign({}, this.defaultState), retry);
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
    return <TournamentList tournaments={tournaments} />;
  }
  return <div>Ingen turneringer er på plass enda, prøve igjen senere</div>;
}

async function getResultsAsProps() {
  try {
    const json = await getTournamentsThatIsEnded();
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
