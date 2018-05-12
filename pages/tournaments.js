import React from "react";
import debug from "debug";
import Link from "next/link";
import fetch from "isomorphic-unfetch";

import Main from "../components/Main";
import Paper from "material-ui/Paper";
import Typography from "material-ui/Typography";
import Button from "material-ui/Button";
import Grid from "material-ui/Grid";
import Divider from "material-ui/Divider";
import { withStyles } from "material-ui/styles";
import withRoot from "../src/withRoot";
import { getTournamentsInTheFuture } from "../src/api";
import moment from "moment";

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

    console.log(tournaments);

    return (
      <React.Fragment>
        <Typography variant="display1" className={classes.tournamentTitle}>
          Turneringer
        </Typography>
        <Paper className={classes.tournamentPaper}>
          <ul className={classes.tournamentList}>
            {tournaments.map(
              (
                {
                  id,
                  name,
                  deadline,
                  startDate,
                  classesText,
                  playerVenue,
                  shortNameProfixio
                },
                index
              ) => {
                return (
                  <li key={id} className={classes.tournamentListItem}>
                    <Grid container spacing={16}>
                      <Grid item xs={4} sm={2} md={1}>
                        {renderDate(startDate)}
                      </Grid>
                      <Grid item>
                        <Typography variant="title">
                          {name} - {playerVenue || ""}
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
                        {renderSignupLink(id, deadline)}
                        {shortNameProfixio && (
                          <a
                            href={`https://www.profixio.com/matches/${shortNameProfixio}`}
                          >
                            <Button color="primary">Kampoppsett</Button>
                          </a>
                        )}
                      </Grid>
                    </Grid>
                    {index < tournaments.length - 1 && <Divider />}
                  </li>
                );
              }
            )}
          </ul>
        </Paper>
      </React.Fragment>
    );
  }
}

function renderDate(date) {
  const [d, m, y] = date.split(".");

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mai",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Okt",
    "Nov",
    "Des"
  ];

  return (
    <div>
      <Typography variant="title">{d}</Typography>
      <Typography variant="subheading">{months[parseInt(m - 1)]}</Typography>
    </div>
  );
}

function renderSignupLink(id, deadline) {
  const timeToDeadLine = moment(deadline, "DD.MM.YYYY")
    .endOf("day")
    .diff(moment.now());
  const signupAllowd = timeToDeadLine > 0;
  if (signupAllowd) {
    // TOOD: client_token do not work when client side rendering, needs to be fixed.
    // until that is fixed this is an a tag and not a Link tag.
    return (
      <a href={`/signup/${id}`}>
        <Button color="primary">Meld deg på</Button>
      </a>
    );
  }
  return null;
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
