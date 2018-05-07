import React from "react";
import fetch from "isomorphic-unfetch";
import Main from "../components/Main";
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "material-ui/Table";
import Typography from "material-ui/Typography";
import Hidden from "material-ui/Hidden";

import { withStyles } from "material-ui/styles";
import withRoot from "../src/withRoot";

import { getJson } from "../src/utils/getJson";
const CircularJSON = require("circular-json");
const log = require("debug")("salt:player");

// Set some styles here later:
const styles = theme => ({});

class PlayerPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      player: {},
      loading: true
    };
  }

  async componentDidMount() {
    try {
      const path = location.pathname.split("/");
      const id = path[path.length - 1];
      const res = await fetch(`/api/players/${id}`);
      const player = await getJson(`/api/players/${id}`);
      const points = await getJson(`/api/points/${id}`);
      this.setState({ player, points, loading: false });
    } catch (err) {
      log(err);
      this.setState({
        loading: false,
        error: true,
        errorDetails: CircularJSON.stringify(err)
      });
    }
  }

  render() {
    const { player, loading, points } = this.state;
    return (
      <Main error loading>
        {renderPlayer(player)}
        {renderRanking(points)}
      </Main>
    );
  }
}

function renderRanking(points) {
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
                ({ tournamentType, tournamentName, points, place }, index) => (
                  <TableRow key={index}>
                    <TableCell numeric>{place}</TableCell>
                    <TableCell>{tournamentName}</TableCell>
                    <Hidden smDown>
                      <TableCell>{tournamentType}</TableCell>
                    </Hidden>
                    <TableCell numeric>{points}</TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        )}
    </React.Fragment>
  );
}
function renderPlayer({ id, firstname, lastname, dateOfBith }) {
  if (!id) {
    return <div>Denne iden er ikke knyttet til en spiller</div>;
  }
  return (
    <div>
      <Typography variant="headline">
        {firstname} {lastname}
      </Typography>
      <p>Fødselsår: {dateOfBith.split(".")[2]}</p>
    </div>
  );
}

export default withRoot(withStyles(styles)(PlayerPage));
