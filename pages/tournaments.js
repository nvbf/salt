import React from "react";
import debug from "debug";
import { withStyles } from "@material-ui/core/styles";

import withRoot from "../src/withRoot";
import Main from "../components/Main";
import { getTournamentsInTheFuture } from "../src/api";
import { TournamentList } from "../components/TournamentList";

const CircularJSON = require("circular-json");
const log = debug("tournaments");

const styles = theme => ({
  tournamentTitle: {
    marginBottom: theme.spacing.unit * 2
  },
  tournamentPaper: theme.mixins.gutters({
    padding: theme.spacing.unit
  }),
  tournamentList: {
    listStyle: "none",
    padding: 0,
    margin: 0
  },
  tournamentListItem: {
    marginBottom: theme.spacing.unit
  }
});

class Tournaments extends React.Component {
  constructor(props) {
    super(props);
    this.retryGetTournaments = this.retryGetTournaments.bind(this);
    this.defaultState = { tournaments: [], loading: true, error: true };

    const { tournaments, error, loading } = this.props;
    this.state = Object.assign({}, this.defaultState, {
      tournaments,
      error,
      loading
    });
  }

  static async getInitialProps() {
    return await getTournamentsAsProps();
  }

  retryGetTournaments() {
    this.setState(this.defaultState);
    this.setState(getTournamentsAsProps());
  }

  render() {
    const { error, loading, errorDetails } = this.state;
    const content = this.getContent();
    return (
      <Main
        error={error}
        errorDetails={errorDetails}
        loading={loading}
        retryHandler={this.retryGetTournaments}
      >
        {content}
      </Main>
    );
  }

  getContent() {
    const { tournaments = [], loading, error } = this.state;
    const { classes } = this.props;

    if (tournaments.length == 0) {
      return <p>Ingen turneringer er på plass enda, prøve igjen senere</p>;
    }

    return <TournamentList tournaments={tournaments} />;
  }
}

async function getTournamentsAsProps() {
  try {
    const json = await getTournamentsInTheFuture();
    return { tournaments: json, loading: false };
  } catch (err) {
    log("Error in getting getTournamentsAsProps");
    log(err.name);
    log(err.message);
    log(err.stack);
    return {
      loading: false,
      error: true,
      errorDetails: CircularJSON.stringify(err)
    };
  }
}

export default withRoot(withStyles(styles)(Tournaments));
