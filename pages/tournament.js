import React from "react";
import fetch from "isomorphic-unfetch";
import Main from "../components/Main";
import debug from "debug";
import moment from "moment";
import Link from "next/link";
import { getJson } from "../src/utils/getJson";
import { getIdFromPath } from "../src/utils/getIdFromPath";
import { PlayerLink } from "../components/utils/playerLinks";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";

import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import CircularJSON from "circular-json";

import withRoot from "../src/withRoot";
import { getTournamentResults } from "../src/api";

const log = debug("tournament");

const styles = theme => ({
  tournamentInfoContainer: {
    padding: theme.spacing.unit
  },
  tournamentInfo: {
    fontWeight: "bold"
  },
  tournamentInfoKlasse: {
    verticalAlign: "top",
    fontWeight: "bold"
  },
  classBox: {
    border: "1px solid black",
    listStyle: "none",
    padding: "5px",
    margin: "5px 0 5px 0"
  }
});

class TournamentPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tournament: {},
      loading: true,
      clicks: 0
    };

    this.onClick = this.onClick.bind(this);
  }

  async componentDidMount() {
    try {
      const id = getIdFromPath();
      const tournament = await getJson(`/api/tournaments/${id}`);
      const tournamentResult = await getTournamentResults(id);
      if (tournament) {
        this.setState({
          tournament: tournament,
          tournamentResult: tournamentResult,
          loading: false
        });
      } else {
        log(`No such tournament?`);
        this.setState({ error: "No such tournament " });
      }
    } catch (error) {
      log(`Error: ${error}`);
      this.setState({ error });
    }
  }

  onClick() {
    const { clicks } = this.state;
    this.setState({
      clicks: clicks + 1
    });
  }

  render() {
    const { tournament, tournamentResult, loading, error, clicks } = this.state;
    if (error) {
      return (
        <Main>
          <p>
            Error:{CircularJSON.stringify(error)} {error.message || ""}
          </p>
        </Main>
      );
    }

    if (loading) {
      return <Main>Loading...</Main>;
    }

    return (
      <Main>
        <section>
          {renderTournament(tournament, this.props.classes, this.onClick)}
        </section>
        <section>
          {!Boolean(tournamentResult.length > 0) && (
            <Typography variant="display2">Seeding</Typography>
          )}
          {!Boolean(tournamentResult.length > 0) &&
            tournament.classes.map((klass, index) => {
              if (klass.teams.length === 0) {
                return null;
              }
              return (
                <section key={index}>
                  <Typography variant="display1">{klass["klasse"]}</Typography>
                  {!(clicks > 5) && renderSeeding(klass)}
                  {clicks > 5 && renderSeedingCopyPaste(klass)}
                </section>
              );
            })}
          {Boolean(tournamentResult.length > 0) && (
            <section>
              <Typography variant="display2">Resultat</Typography>
              {tournamentResult.map(klasse => renderResultList(klasse))}
            </section>
          )}
        </section>
      </Main>
    );
  }
}

function renderTournament(tournament, classes, onClick) {
  return (
    <section>
      <h1>{tournament.name}</h1>
      <Paper onClick={onClick} className={classes.tournamentInfoContainer}>
        <table>
          <tbody>
            <tr>
              <td className={classes.tournamentInfo}>Start</td>
              <td>
                {tournament.startDate} - {tournament.startTime}
              </td>
            </tr>
            <tr>
              <td className={classes.tournamentInfo}>Type</td>
              <td>{tournament.tournamentType}</td>
            </tr>
            {tournament.tournamentDirector && (
              <tr>
                <td className={classes.tournamentInfo}>Turneringsleder</td>
                <td>{tournament.tournamentDirector}</td>
              </tr>
            )}
            {tournament.email && (
              <tr>
                <td className={classes.tournamentInfo}>epost</td>
                <td>{tournament.email}</td>
              </tr>
            )}
            {tournament.phone && (
              <tr>
                <td className={classes.tournamentInfo}>telefonnummer</td>
                <td>{tournament.phone}</td>
              </tr>
            )}
            <tr>
              <td className={classes.tournamentInfoKlasse}>Klasse(r)</td>
              <td>{renderClasses(tournament, classes)}</td>
            </tr>
            <tr>
              <td className={classes.tournamentInfo}>Påmeldingsfrist</td>
              <td>{tournament.deadline}</td>
            </tr>
            <tr>
              <td className={classes.tournamentInfo}>Sted</td>
              <td>{tournament.playerVenue || "Ikke oppgitt"}</td>
            </tr>
            <tr>
              <td className={classes.tournamentInfo}>Påmelding</td>
              <td>{renderSignupLink(tournament)}</td>
            </tr>
            {tournament.shortNameProfixio && (
              <tr>
                <td className={classes.tournamentInfo}>Kampoppsett</td>
                <td>
                  <a
                    href={`https://www.profixio.com/matches/${
                      tournament.shortNameProfixio
                    }`}
                  >
                    Profixio
                  </a>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Paper>
    </section>
  );
}

function renderClasses(tournament, classes) {
  return tournament.classes.map((klass, index) => (
    <ul className={classes.classBox} key={index}>
      <li>Klasse {klass["klasse"]}</li>
      <li>Pris {klass.price}</li>
      <li>
        Påmeldte {klass.teams.length} av {klass.maxNrOfTeams}
      </li>
    </ul>
  ));
}

function renderSignupLink(tournament) {
  const { deadline, tournamentId } = tournament;
  const timeToDeadLine = moment(deadline).diff(moment.now());
  const signupAllowd = timeToDeadLine > 0;
  if (signupAllowd) {
    return <a href={`/signup/${tournamentId}`}>Meld deg på</a>;
  } else {
    return "Påmelding stengt";
  }
}

function getShortName(player) {
  const nameParts = player.trim().split(/\s+/);
  if (nameParts.length == 1) {
    return nameParts[0];
  }

  let nameString = nameParts[0][0] + ". ";
  nameString += nameParts[nameParts.length - 1];
  return nameString;
}

function renderSeedingCopyPaste(klass) {
  const teams = klass.teams.sort((a, b) => b.teamPoints - a.teamPoints);
  return (
    <Table>
      <TableBody>
        {teams.map((team, index) => {
          const players = team.teamName.split("/");
          const teamNameShort =
            getShortName(players[0]) + " / " + getShortName(players[1]);
          return (
            <TableRow key={index}>
              <TableCell>{teamNameShort}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

function renderSeeding(klass) {
  const teams = klass.teams.sort((a, b) => b.teamPoints - a.teamPoints);
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Seeding</TableCell>
          <TableCell>Spiller 1</TableCell>
          <TableCell>Spiller 2</TableCell>
          <TableCell numeric>Poeng</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {teams.map((team, index) => {
          const players = team.teamName.split("/");
          return (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                <PlayerLink id={team.player1Id}>{players[0]}</PlayerLink> ({
                  team.player1Points
                })
              </TableCell>
              <TableCell>
                <PlayerLink id={team.player2Id}>{players[1]}</PlayerLink> ({
                  team.player2Points
                })
              </TableCell>
              <TableCell numeric>{team.teamPoints}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

function renderResultList(result) {
  return (
    <section>
      <Typography variant="display1">{result["class"]}</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Lag</TableCell>
            <TableCell numeric>Poeng</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{renderResultListBody(result.teams)}</TableBody>
      </Table>
    </section>
  );
}

function renderResultListBody(results) {
  return results.map((result, key) => (
    <TableRow key={key}>
      <TableCell>{result.place}</TableCell>
      <TableCell>{result.teamNameShort}</TableCell>
      <TableCell numeric>{result.points}</TableCell>
    </TableRow>
  ));
}

export default withRoot(withStyles(styles)(TournamentPage));
