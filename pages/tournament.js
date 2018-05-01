import React from "react";
import fetch from "isomorphic-unfetch";
import Head from "../components/head";
import Nav from "../components/nav";
import debug from "debug";
import moment from "moment";
import Link from "next/link";
import { getJson } from "../src/utils/getJson";
import { getIdFromPath } from "../src/utils/getIdFromPath";
import styled from "styled-components";
import { PlayerLink } from "../components/utils/playerLinks";

const log = debug("tournament");

const StyledSpan = styled.span`
  font-weight: bold;
`;

const StyledUL = styled.ul`
  border: 1px solid black;
`;

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = { tournament: {}, loading: true };
  }

  async componentDidMount() {
    try {
      const id = getIdFromPath();
      const tournament = await getJson(`/api/tournaments/${id}`);
      if (tournament) {
        this.setState({ tournament: tournament, loading: false });
      } else {
        log(`No such tournament?`);
        this.setState({ error: "No such tournament " });
      }
    } catch (error) {
      log(`Error: ${error}`);
      this.setState({ error });
    }
  }

  render() {
    const { tournament, loading, error } = this.state;
    log(tournament);
    if (error) {
      return (
        <div>
          <Head title="Home" />
          <Nav />
          <p>Error:{error}</p>
        </div>
      );
    }

    if (loading) {
      return (
        <div>
          <Head title="Home" />
          <Nav />
          Loading...
        </div>
      );
    }
    return (
      <div>
        <Head title="Home" />
        <Nav />
        {renderTournament(tournament)}
      </div>
    );
  }
}

function renderTournament(tournament) {
  log(`tournament: ${tournament}`);
  return (
    <main>
      <h1>{tournament.name}</h1>
      <ul>
        <li>
          <StyledSpan>Start </StyledSpan> {tournament.startDate} -
          {tournament.startTime}
        </li>
        <li>
          <StyledSpan>Type </StyledSpan> {tournament.tournamentType}
        </li>
        <li>
          <StyledSpan>Klasse </StyledSpan>
          {renderClasses(tournament)}
        </li>
        <li>
          <StyledSpan>Påmeldingsfrist </StyledSpan> {tournament.deadline}
        </li>
        <li>
          <StyledSpan>Sted </StyledSpan>
          {tournament.playerVenue || "Ikke oppgitt"}
        </li>
        <li>
          <StyledSpan>Påmelding</StyledSpan> {renderSignupLink(tournament)}
        </li>
      </ul>
      <h2>Seeding</h2>
      {tournament.classes.map((klass, index) => {
        if (klass.teams.length === 0) {
          return null;
        }
        return (
          <React.Fragment key={index}>
            <h3>{klass["class"]}</h3>
            {renderSeeding(klass)}
          </React.Fragment>
        );
      })}
    </main>
  );
}

function renderClasses(tournament) {
  return tournament.classes.map((klass, index) => (
    <StyledUL key={index}>
      <li>Klasse {klass["class"]}</li>
      <li>Pris {klass.price}</li>
      <li>
        Påmeldte {klass.teams.length} av {klass.maxNrOfTeams}
      </li>
    </StyledUL>
  ));
}

function renderSignupLink(tournament) {
  console.log("renderSignupLink", tournament);
  const { deadline, id } = tournament;
  const timeToDeadLine = moment(deadline, "DD.MM.YYYY").diff(moment.now());
  const signupAllowd = timeToDeadLine > 0;
  if (signupAllowd) {
    return <a href={`/signup/${id}`}>Meld deg på</a>;
  } else {
    return "Påmelding stengt";
  }
}

function renderSeeding(klass) {
  return (
    <table>
      <thead>
        <tr>
          <th>Seeding</th>
          <th>Spiller 1</th>
          <th>Spiller 2</th>
          <th>Sum</th>
        </tr>
      </thead>
      <tbody>
        {klass.teams.map((team, index) => {
          const players = team.teamName.split("/");
          return (
            <tr key={index}>
              <td>{index}</td>
              <td>
                <PlayerLink id={team.player1Id}>
                  <span>
                    {players[0]} ({team.player1Points})
                  </span>
                </PlayerLink>
              </td>
              <td>
                <PlayerLink id={team.player2Id}>
                  <span>
                    {players[1]} ({team.player2Points})
                  </span>
                </PlayerLink>
              </td>
              <td>{team.teamPoints}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
