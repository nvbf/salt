import React from "react";
import debug from "debug";
import Link from "next/link";
import fetch from "isomorphic-unfetch";
import { Main } from "../components/Main";
import { ClassSelect } from "../components/ClassSelect";

import { getIdFromPath } from "../src/utils/getIdFromPath";
import { getJson } from "../src/utils/getJson";
import { resolve } from "upath";
import { groupByGender } from "../src/utils/groupByGender";

const dropin = require("braintree-web-drop-in");
const log = debug("players");

export default class Signup extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.showPayment = this.showPayment.bind(this);
    this.signup = this.signup.bind(this);
    this.handleErrorResponse = this.handleErrorResponse.bind(this);
    this.handleValidResponse = this.handleValidResponse.bind(this);

    this.state = {
      signupClass: false,
      male: [],
      female: [],
      tournament: {},
      loading: true,
      paymentMessage: "",
      paymentStatus: "",
      error: null
    };
  }

  handleChange(event) {
    // de not set state on defaultValue
    if (event.target.value == " ") {
      return;
    }
    this.setState({ signupClass: event.target.value });
  }

  static async getInitialProps({ query, req }) {
    if (req) {
      const getClientToken = require("./../src/utils/getClientToken");
      const token = await getClientToken();
      return { clientToken: token };
    } else {
      // TODO:this do not work, seems like braintree to not accept it,
      // we need to do a page refresh and create it on the server side.
      const token = await fetch("/client_token");
      return { clientToken: token };
    }
  }

  showPayment() {
    dropin.create(
      {
        authorization: this.props.clientToken,
        container: "#dropin-container"
      },
      (createErr, instance) => {
        if (createErr) {
          log(`createError ${JSON.stringify(createErr)}`);
        }
        var button = document.querySelector("#submit-button");
        button.addEventListener("click", event => {
          event.preventDefault();
          instance.requestPaymentMethod((requestPaymentMethodErr, payload) => {
            button.disabled = true;
            if (requestPaymentMethodErr) {
              return log(`requestPaymentMethodErr ${requestPaymentMethodErr}`);
            }
            log("payload.nonce", payload.nonce);
            this.signup(payload.nonce);
          });
        });
      }
    );
  }

  signup(nonce = "free") {
    const data = JSON.stringify({
      nonce: nonce,
      tournamentId: getIdFromPath(),
      player1: getSelectedValueFromDropDownWithId("#player1"),
      player2: getSelectedValueFromDropDownWithId("#player2"),
      klasse: this.state.signupClass,
      email: document.querySelector("#email").value
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
    console.log("statusText, error, message", statusText, error, message);
    this.setState({
      paymentStatus: statusText,
      paymentMessage: error || message
    });
  }

  handleErrorResponse(res) {
    console.log("error res", res);
    this.setState({
      paymentStatus: "error",
      paymentMessage:
        "En feil har oppstått, prøv igjen. Får du denne feilmeldingen flere ganger send en sms til 93008598 og gi beskjed"
    });
  }

  async componentDidMount() {
    try {
      const id = getIdFromPath();
      const players = await getJson("/api/players");
      const tournament = await getJson(`/api/tournaments/${id}`);
      this.setState({
        ...groupByGender(players),
        tournament: tournament,
        loading: false
      });
    } catch (err) {
      //TODO: make this visibale for the end user
      log(err);
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

  renderError() {
    return (
      <Main>
        <h1> {name}</h1>
        <h3>Error</h3>
        <p>
          Beklager en ukjent feil skjedde! Prøv igjen nå eller om en liten
          stund.
        </p>
      </Main>
    );
  }

  render() {
    const {
      male,
      female,
      tournament: { name, classes },
      loading,
      paymentStatus,
      signupClass,
      error
    } = this.state;
    if (loading) {
      return <Main>Loading...</Main>;
    }
    if (paymentStatus === "OK") {
      return this.renderPaymentStatusOK();
    }
    if (paymentStatus === "error") {
      return this.renderPaymentStatusError();
    }
    if (error) {
      this.renderError();
    }

    if (!signupClass) {
      return (
        <Main>
          <h1> {name}</h1>
          <ClassSelect classes={classes} handleChange={this.handleChange} />
        </Main>
      );
    }
    const correctClass = getClassInfoFromClass(signupClass, classes);
    const klass1 = correctClass["class"];
    let players;
    log("klass1", klass1);
    if (klass1 == "K") {
      players = female;
    } else if (klass1 == "M") {
      players = male;
    } else {
      players = female.concat(male);
    }

    return (
      <Main>
        <h1> {name}</h1>
        {renderSignup(players, correctClass.price)}
        <p>
          Mangler det et navn? Send mail til{" "}
          <a href="mailto:post@osvb.no">post@osvb.no</a>{" "}
        </p>
        <h4> Email for kvittering:</h4>
        <input type="text" id="email" />
        <h4>Klasse: {klass1} </h4>
        <h4>Pris: {correctClass.price || "Gratis"} </h4>
        <div id="dropin-container" />
        <button onClick={this.showPayment} id="submit-button">
          Betale
        </button>
      </Main>
    );
  }
}

function renderSignup(players) {
  if (players.length > 1) {
    return (
      <section>
        <h4> Spiller 1</h4>
        <select id="player1">{listPlayers(players)}</select>
        <h4> Spiller 2</h4>
        <select id="player2">{listPlayers(players)}</select>
      </section>
    );
  }
  return <div>Ingen spillere er registert</div>;
}

function getSelectedValueFromDropDownWithId(selector) {
  var dropdown = document.querySelector(selector);
  return dropdown.options[dropdown.selectedIndex].value;
}

function listPlayers(players) {
  players = players.sort(compareOnLastname);
  return players.map(({ firstname, lastname, id }) => {
    return (
      <option key={id} value={id}>
        {lastname}, {firstname}
      </option>
    );
  });
}

function compareOnLastname(a, b) {
  if (`${a.lastname} ${a.firstname}` < `${b.lastname} ${b.firstname}`)
    return -1;
  if (`${a.lastname} ${a.firstname}` > `${b.lastname} ${b.firstname}`) return 1;
  return 0;
}

function getClassInfoFromClass(klass, classes) {
  const correctClass = classes.filter(klass1 => klass1["class"] === klass);
  if (correctClass.length != 1) {
    console.log("getClassInfoFromClass problem", correctClass, classes, klass);
  }
  return correctClass[0];
}
