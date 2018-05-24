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
      console.log(
        "tournamentResulttournamentResulttournamentResulttournamentResulttournamentResult",
        tournamentResult
      );
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
    log(tournamentResult);
    if (error) {
      return (
        <Main>
          <p>Error:{error}</p>
        </Main>
      );
    }

    if (loading) {
      return <Main>Loading...</Main>;
    }

    return (
      <Main>
        {renderTournament(
          tournament,
          this.props.classes,
          this.onClick,
          clicks > 5 ? true : false
        )}
        {renderResultList(tournamentResult)}
      </Main>
    );
  }
}

function renderTournament(tournament, classes, onClick, showCopyPaste) {
  log(`tournament: ${tournament}`);
  return (
    <main>
      <h1>{tournament.name}</h1>
      <Paper onClick={onClick} className={classes.tournamentInfoContainer}>
        <table>
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
        </table>
      </Paper>
      <h2>Påmeldte</h2>
      {tournament.classes.map((klass, index) => {
        if (klass.teams.length === 0) {
          return null;
        }
        return (
          <React.Fragment key={index}>
            <h3>{klass["class"]}</h3>
            {!showCopyPaste && renderSeeding(klass)}
            {showCopyPaste && renderSeedingCopyPaste(klass)}
          </React.Fragment>
        );
      })}
    </main>
  );
}

function renderClasses(tournament, classes) {
  return tournament.classes.map((klass, index) => (
    <ul className={classes.classBox} key={index}>
      <li>Klasse {klass["class"]}</li>
      <li>Pris {klass.price}</li>
      <li>
        Påmeldte {klass.teams.length} av {klass.maxNrOfTeams}
      </li>
    </ul>
  ));
}

function renderSignupLink(tournament) {
  const { deadline, id } = tournament;
  const timeToDeadLine = moment(deadline, "DD.MM.YYYY")
    .endOf("day")
    .diff(moment.now());
  const signupAllowd = timeToDeadLine > 0;
  if (signupAllowd) {
    return <a href={`/signup/${id}`}>Meld deg på</a>;
  } else {
    return "Påmelding stengt";
  }
}

function renderSeedingCopyPaste(klass) {
  const teams = klass.teams.sort((a, b) => b.teamPoints - a.teamPoints);
  return (
    <Table>
      <TableBody>
        {teams.map((team, index) => {
          const players = team.teamName.split("/");
          return (
            <TableRow key={index}>
              <TableCell>{team.teamNameShort}</TableCell>
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
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>#</TableCell>
          <TableCell>Lag</TableCell>
          <TableCell numeric>Poeng</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>{renderResultListBody(result)}</TableBody>
    </Table>
  );
}

function renderResultListBody(results) {
  console.log("resultsresultsresultsresults:", results.length);
  return results.map((result, key) => (
    <TableRow key={key}>
      <TableCell>{result.place}</TableCell>
      <TableCell>Navnet kommer snart her atså! lover!</TableCell>
      <TableCell numeric>{result.points}</TableCell>
    </TableRow>
  ));
}

export default withRoot(withStyles(styles)(TournamentPage));
