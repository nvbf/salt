import React from "react";
import debug from "debug";
import Link from "next/link";
import fetch from "isomorphic-unfetch";

import Main from "../components/Main";
import Paper from "material-ui/Paper";
import Typography from "material-ui/Typography";
import Button from "material-ui/Button";
import { withStyles } from "material-ui/styles";
import withRoot from "../src/withRoot";
import { getTournamentsInTheFuture } from "../src/api";

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

    return (
      <React.Fragment>
        <Typography variant="display1" className={classes.tournamentTitle}>
          Turneringer
        </Typography>
        <ul className={classes.tournamentList}>
          {tournaments.map(
            (
              { id, name, deadline, startDate, classesText, playerVenue },
              tournament
            ) => {
              return (
                <li key={tournament} className={classes.tournamentListItem}>
                  <Paper className={classes.tournamentPaper}>
                    <Typography variant="title">
                      {name} {playerVenue || ""} {startDate}
                    </Typography>
                    <p>
                      <Typography variant="body2">
                        Påmeldingsfrist: {deadline}
                      </Typography>
                    </p>
                    <p>
                      <Typography variant="body1">
                        Klasser: {classesText}
                      </Typography>
                    </p>

                    <Link href={"/tournament"} as={`/tournaments/${id}`}>
                      <Button color="primary">Påmeldte</Button>
                    </Link>
                    <Link href={"/signup"} as={`/signup/${id}`}>
                      <Button color="primary">Meld deg på</Button>
                    </Link>
                  </Paper>
                </li>
              );
            }
          )}
        </ul>
      </React.Fragment>
    );
  }
}

function renderTableData(props) {
  const keys = ["startDate", "deadline", "classesText"];
  return keys.map(key => <td key={key}>{props[key]}</td>);
}

async function getTournamentsAsProps() {
  try {
    const json = await getTournamentsInTheFuture();
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

export default withRoot(withStyles(styles)(Tournaments));
