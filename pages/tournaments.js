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
import { getJson } from "../src/utils/getJson";

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

    this.getTournaments = this.getTournaments.bind(this);

    this.defaultState = { players: [], loading: true };
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
  async getInitalPage() {
    await this.getTournaments();
  }

  render() {
    const content = this.getContent();
    return (
      <Main error errorDetails loading retryHandler={this.getTournaments}>
        {content}
      </Main>
    );
  }

  getContent() {
    const { tournaments = [], loading, error } = this.state;
    if (tournaments.length == 0) {
      return <p>Ingen turneringer er på plass enda, prøve igjen senere</p>;
    }
    const { classes } = this.props;

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
                <li className={classes.tournamentListItem}>
                  <Paper key={tournament} className={classes.tournamentPaper}>
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

export default withRoot(withStyles(styles)(Tournaments));
