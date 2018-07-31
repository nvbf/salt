import React from "react";
import fetch from "isomorphic-unfetch";
import Main from "../components/Main";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import Typography from "@material-ui/core/Typography";
import Hidden from "@material-ui/core/Hidden";

import { withStyles } from "@material-ui/core/styles";
import withRoot from "../src/withRoot";

import { getPlayer, getPointsFromPlayer } from "../src/api/";
const CircularJSON = require("circular-json");
const log = require("debug")("salt:player");

// Set some styles here later:
const styles = theme => ({
  topN: {
    fontWeight: "bold"
  }
});

class PlayerPage extends React.Component {
  constructor(props) {
    super(props);
    this.defaultState = {
      player: {},
      points: [],
      error: false,
      loading: true
    };

    this.retryGetPlayers = this.retryGetPlayers.bind(this);

    const {
      loading = this.defaultState.loading,
      error = this.defaultState.error,
      points = this.defaultState.points,
      player = this.defaultState.player,
      errorDetails = ""
    } = this.props;
    this.state = Object.assign({}, this.defaultState, {
      loading,
      error,
      errorDetails,
      points,
      player
    });
  }

  componentDidMount() {
    window.retryHandler = this.retryGetPlayers;
  }

  static async getInitialProps({ asPath }) {
    return await getPlayerAsProps(asPath);
  }

  async retryGetPlayers() {
    this.setState(this.defaultState, async () => {
      this.setState(await getPlayerAsProps(location.pathname));
    });
  }

  render() {
    const { loading, error, player, points } = this.state;
    const { classes } = this.props;

    return (
      <Main error={error} loading={loading} retryHandler={this.retryGetPlayers}>
        {renderPlayer(player)}
        {renderRanking(points, classes)}
      </Main>
    );
  }
}

function renderRanking(points, classes) {
  if (points.length === 0) {
    return (
      <React.Fragment>
        <h3>Ranking </h3>
        <p>Ingen turneringer registert </p>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <Typography variant="title">Resultater </Typography>
      {(!points || !points.map) && <p>Ingen poeng registert</p>}
      {points &&
        points.map && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Turnering</TableCell>
                <Hidden smDown>
                  <TableCell>Type</TableCell>
                </Hidden>
                <TableCell numeric>Poeng</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {points.map(
                (
                  { tournamentType, tournamentName, points, place, topn },
                  index
                ) => {
                  const cls = topn ? classes.topN : null;
                  return (
                    <TableRow key={index}>
                      <TableCell className={cls} numeric>
                        {place}
                      </TableCell>
                      <TableCell className={cls}>{tournamentName}</TableCell>
                      <Hidden smDown>
                        <TableCell className={cls}>{tournamentType}</TableCell>
                      </Hidden>
                      <TableCell numeric className={cls}>
                        {points}
                      </TableCell>
                    </TableRow>
                  );
                }
              )}
            </TableBody>
          </Table>
        )}
    </React.Fragment>
  );
}

function renderPlayer({ playerId, firstname, lastname }) {
  if (!playerId) {
    return <div>Denne iden er ikke knyttet til en spiller</div>;
  }
  return (
    <div>
      <Typography variant="headline">
        {firstname} {lastname}
      </Typography>
    </div>
  );
}

async function getPlayerAsProps(pathname) {
  try {
    const path = pathname.split("/");
    const id = path[path.length - 1];
    const player = await getPlayer(id);
    const points = await getPointsFromPlayer(id);

    return { player, points, loading: false, error: false };
  } catch (err) {
    log(err);
    return {
      loading: false,
      error: true
      // errorDetails: CircularJSON.stringify(err)
    };
  }
}

export default withRoot(withStyles(styles)(PlayerPage));
