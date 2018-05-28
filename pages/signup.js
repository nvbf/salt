import React from "react";
import debug from "debug";
import Link from "next/link";
import fetch from "isomorphic-unfetch";
import Main from "../components/Main";
import StepChooseClass from "../components/StepChooseClass";
import StepChoosePlayers from "../components/StepChoosePlayers";
import StepEmailReceipt from "../components/StepEmailReceipt";
import StepPayment from "../components/StepPayment";

import Typography from "@material-ui/core/Typography";

import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepContent from "@material-ui/core/StepContent";
import StepLabel from "@material-ui/core/StepLabel";

import { withStyles } from "@material-ui/core/styles";
import { getIdFromPath } from "../src/utils/getIdFromPath";
import { getJson } from "../src/utils/getJson";
import { resolve } from "upath";
import withRoot from "../src/withRoot";
import moment from "moment";

const log = debug("signup");

const styles = theme => ({
  root: {
    color: "red"
  },
  actionsContainer: {
    marginBottom: theme.spacing.unit * 2
  }
});

class SignupPage extends React.Component {
  constructor(props) {
    super(props);

    this.onSetClass = this.onSetClass.bind(this);
    this.onSetPlayers = this.onSetPlayers.bind(this);
    this.onSetReceiptEmail = this.onSetReceiptEmail.bind(this);

    this.onSignUp = this.onSignUp.bind(this);

    this.onGoBack = this.onGoBack.bind(this);

    this.handleErrorResponse = this.handleErrorResponse.bind(this);
    this.handleValidResponse = this.handleValidResponse.bind(this);

    this.state = {
      signupClass: false,
      receiptEmail: "",
      players: [],
      player1: null,
      player2: null,
      tournament: {},
      loading: true,
      priceToPay: 0,
      paymentMessage: "",
      paymentStatus: "",
      activeStep: 0
    };
  }

  onSetClass(className) {
    console.log("onSetClass", className);
    const { activeStep, tournament, players } = this.state;

    const correctClass = getClassInfoFromClass(className, tournament.classes);
    const playersAlreadySignup = getPlayerIdsFromTournamentClass(
      tournament,
      correctClass
    );
    const playerHasNotSignup = id =>
      playersAlreadySignup.findIndex(playerId => playerId == id) === -1;

    const filteredPlayers = players.filter(({ id }) => playerHasNotSignup(id));

    this.setState({
      signupClass: className,
      priceToPay: correctClass.price,
      activeStep: activeStep + 1,
      players: filteredPlayers
    });
  }

  onGoBack() {
    const { activeStep } = this.state;
    this.setState({
      activeStep: activeStep - 1
    });
  }

  onSetPlayers(players) {
    const { activeStep } = this.state;

    this.setState({
      player1: players[0],
      player2: players[1],
      activeStep: activeStep + 1
    });
  }

  onSetReceiptEmail(emailAddress) {
    const { activeStep } = this.state;

    this.setState({
      receiptEmail: emailAddress,
      activeStep: activeStep + 1
    });
  }

  onSignUp(nonce = "free") {
    const { player1, player2, signupClass, receiptEmail } = this.state;

    const data = JSON.stringify({
      nonce: nonce,
      tournamentId: getIdFromPath(),
      player1: player1.playerId,
      player2: player2.playerId,
      klasse: signupClass,
      email: receiptEmail
    });

    log(`signup data: ${data}`);

    const res = fetch("/tournaments/checkout/", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST",
      body: data
    })
      .then(this.handleValidResponse)
      .catch(this.handleErrorResponse);
  }

  async handleValidResponse(res) {
    const { statusText, error, message = "" } = await res.json();
    log("statusText, error, message", statusText, error, message);
    this.setState({
      paymentStatus: statusText,
      paymentMessage: error || message
    });
  }

  handleErrorResponse(res) {
    log("error res", res);
    this.setState({
      paymentStatus: "error",
      paymentMessage:
        "En feil har oppstått, prøv igjen. Får du denne feilmeldingen flere ganger send en sms til 93008598 og gi beskjed"
    });
  }

  static async getInitialProps({ query, req }) {
    if (req) {
      const getClientToken = require("./../src/utils/getClientToken");
      const token = await getClientToken();
      return { clientToken: token };
    } else {
      const token = await fetch("/client_token");
      return { clientToken: token };
    }
  }

  async componentDidMount() {
    try {
      const id = getIdFromPath();
      let players = await getJson("/api/players");

      players.sort((a, b) => {
        return `${a.firstname} ${a.lastname}`.localeCompare(
          `${b.firstname} ${b.lastname}`
        );
      });

      const tournament = await getJson(`/api/tournaments/${id}`);
      this.setState({
        players: players,
        tournament: tournament,
        loading: false
      });
    } catch (err) {
      //TODO: make this visibale for the end user
      this.setState({ error: "Problem..." });
    }
  }

  renderPaymentStatusOK() {
    const { name } = this.state.tournament;
    return (
      <Main>
        <h1> {name}</h1>
        <p>
          Betalingen er registert og dere er påmeldt til turneringen. Kvittering
          er sendt på mail
        </p>
      </Main>
    );
  }

  renderPaymentStatusError() {
    return (
      <Main>
        <h1> {name}</h1>
        <h3>Error</h3>
        <p>{this.state.paymentMessage}</p>
      </Main>
    );
  }

  signupExpired(tournament) {
    const { deadline } = tournament;
    const timeToDeadLine = moment(deadline, "DD.MM.YYYY")
      .endOf("day")
      .diff(moment.now());
    const signupAllowd = timeToDeadLine > 0;
    if (signupAllowd) {
      return false;
    } else {
      return true;
    }
  }

  render() {
    const {
      players,
      tournament,
      loading,
      paymentStatus,
      signupClass,
      activeStep,
      priceToPay,
      player1,
      player2,
      receiptEmail
    } = this.state;

    const { clientToken } = this.props;

    if (loading) {
      return <Main>Loading...</Main>;
    }

    if (this.signupExpired(tournament)) {
      return <Main>Påmeldinga er stengt</Main>;
    }

    if (paymentStatus === "OK") {
      return this.renderPaymentStatusOK();
    }
    if (paymentStatus === "error") {
      return this.renderPaymentStatusError();
    }

    let currentPlayers = players;

    if (signupClass) {
      currentPlayers = players.filter(player => player.gender === signupClass);
    }

    return (
      <Main>
        <Typography variant="title">Påmelding {tournament.name}</Typography>
        <Stepper activeStep={activeStep} orientation="vertical">
          <Step>
            <StepLabel>
              Velg Klasse
              {signupClass && <div>{signupClass}</div>}
            </StepLabel>
            <StepContent>
              <StepChooseClass
                currentClass={signupClass}
                tournamentClasses={tournament.classes}
                onSetClass={this.onSetClass}
              />
            </StepContent>
          </Step>
          <Step>
            <StepLabel>
              Velg Spillere
              {player1 && (
                <div>
                  {player1.firstname} {player1.lastname} og {player2.firstname}{" "}
                  {player2.lastname}
                </div>
              )}
            </StepLabel>
            <StepContent>
              <StepChoosePlayers
                players={currentPlayers}
                player1={player1}
                player2={player2}
                onSetPlayers={this.onSetPlayers}
                onGoBack={this.onGoBack}
              />
            </StepContent>
          </Step>
          <Step>
            <StepLabel>
              Kvittering på Epost
              {receiptEmail && <div>{receiptEmail}</div>}
            </StepLabel>
            <StepContent>
              <StepEmailReceipt
                receiptEmail={receiptEmail}
                onSetReceiptEmail={this.onSetReceiptEmail}
                onGoBack={this.onGoBack}
              />
            </StepContent>
          </Step>
          <Step>
            <StepLabel>Betaling</StepLabel>
            <StepContent>
              <StepPayment
                onSignUp={this.onSignUp}
                priceToPay={priceToPay}
                clientToken={clientToken}
                onGoBack={this.onGoBack}
              />
            </StepContent>
          </Step>
        </Stepper>
      </Main>
    );
  }
}

function getClassInfoFromClass(klass, classes) {
  const correctClass = classes.filter(klass1 => klass1["class"] === klass);
  if (correctClass.length != 1) {
    log("getClassInfoFromClass problem", correctClass, classes, klass);
  }
  return correctClass[0];
}

function getPlayerIdsFromTournamentClass(tournament, klasse) {
  const chosenClassArray = tournament.classes.filter(
    tournament => tournament["class"] == klasse.class
  );
  const teams = chosenClassArray[0].teams;
  const playerIdsNotFlat = teams.map(({ player1Id, player2Id }) => [
    player1Id,
    player2Id
  ]);
  const playerIds = playerIdsNotFlat.reduce((acc, val) => acc.concat(val), []);
  return playerIds;
}

export default withRoot(withStyles(styles)(SignupPage));
