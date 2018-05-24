import React from "react";
import debug from "debug";
import Link from "next/link";
import Main from "../components/Main";

import { Loading } from "../components/loading";
import { withStyles } from "material-ui/styles";
import withRoot from "../src/withRoot";

import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "material-ui/Table";
import Typography from "material-ui/Typography";
import Grid from "material-ui/Grid";
import Button from "material-ui/Button";

const { getRanking } = require("../src/api/index");
const CircularJSON = require("circular-json");
const log = debug("salt:ranking");

const styles = theme => ({
  showAllButton: {
    marginTop: theme.spacing.unit,
    marginLeft: "auto",
    marginRight: "auto"
  },
  genderHeading: {
    marginTop: theme.spacing.unit * 3
  }
});

class RankingPage extends React.Component {
  constructor(props) {
    super(props);

    this.retryGetRanking = this.retryGetRanking.bind(this);
    this.defaultState = {
      male: [],
      allMales: false,
      female: [],
      allFemales: false,
      loading: true,
      error: false
    };
    const {
      loading = this.defaultState.loading,
      error = this.defaultState.error,
      male = this.defaultState.male,
      female = this.defaultState.female
    } = props;

    this.state = Object.assign({}, this.defaultState, {
      loading,
      error,
      male,
      female
    });
  }

  async retryGetRanking() {
    this.setState(Object.assign({}, this.defaultState));
    this.setState(await getRankingAsProps());
  }

  static async getInitialProps() {
    return getRankingAsProps();
  }

  render() {
    let {
      male,
      female,
      loading,
      error,
      errorDetails,
      allFemales,
      allMales
    } = this.state;

    if (!allMales) male = male.slice(0, 10);
    if (!allFemales) female = female.slice(0, 10);

    const { classes } = this.props;

    return (
      <Main
        error={error}
        loading={loading}
        errorDetails={errorDetails}
        retryHandler={this.retryGetRanking}
      >
        <Typography variant="display1">Spillerranking 2018</Typography>
        <Grid container spacing={12} alignItems="top" alignContent="center">
          <Grid item xs={12} md={6}>
            <Typography className={classes.genderHeading} variant="title">
              Damer
            </Typography>
            {renderPlayers(female)}
            {!allFemales && (
              <Button
                variant="raised"
                color="primary"
                className={classes.showAllButton}
                onClick={() => {
                  this.setState({ allFemales: true });
                }}
              >
                Vis Alle
              </Button>
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography className={classes.genderHeading} variant="title">
              Herrer
            </Typography>
            {renderPlayers(male)}
            {!allMales && (
              <Button
                variant="raised"
                color="primary"
                className={classes.showAllButton}
                onClick={() => {
                  this.setState({ allMales: true });
                }}
              >
                Vis Alle
              </Button>
            )}
          </Grid>
        </Grid>
      </Main>
    );
  }
}

function renderPlayers(players) {
  if (players.length > 1) {
    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Spiller</TableCell>
            <TableCell numeric>Poeng</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{listTournaments(players)}</TableBody>
      </Table>
    );
  }
  return <div>Ingen spillere er registert</div>;
}

function listTournaments(players) {
  const rows = players.reduce(
    (row, player, key) => {
      let displayPosition = "";
      if (row.lastSum != player.sum) {
        row.lastSum = player.sum;
        displayPosition = row.lastIdx;
      }
      row.lastIdx++;

      row.players.push(
        <TableRow key={key}>
          <TableCell>{displayPosition}</TableCell>
          <TableCell>
            <Link href={`/players/${player.id}`}>
              <a href={`/players/${player.id}`} color="primary">
                {player.name}
              </a>
            </Link>
          </TableCell>
          <TableCell numeric>{player.sum}</TableCell>
        </TableRow>
      );
      return row;
    },
    {
      lastIdx: 1,
      lastSum: -1,
      players: []
    }
  );

  return rows.players;
}

async function getRankingAsProps() {
  try {
    const players = await getRanking();
    const male = players.filter(player => player.gender == "M");
    const female = players.filter(player => player.gender == "K");

    return { male, female, loading: false };
  } catch (err) {
    log(`error ${CircularJSON.stringify(err)}`);
    return {
      loading: false,
      error: true,
      errorDetails: CircularJSON.stringify(err)
    };
  }
}

export default withRoot(withStyles(styles)(RankingPage));
