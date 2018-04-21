import React from "react";
import debug from "debug";
import Link from "next/link";
import fetch from "isomorphic-unfetch";
import { Main } from "../components/Main";
import { ClassSelect } from "../components/ClassSelect";

import { getIdFromPath } from "../src/utils/getIdFromPath";
import { getJson } from "../src/utils/getJson";

const dropin = require("braintree-web-drop-in");
const log = debug("players");

export default class Signup extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.showPayment = this.showPayment.bind(this);

    this.state = {
      signupClass: false,
      players: [],
      tournament: {},
      loading: true
    };
  }

  handleChange(event) {
    this.setState({ signupClass: event.target.value });
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

  showPayment() {
    dropin.create(
      {
        authorization: this.props.clientToken,
        container: "#dropin-container"
      },
      function(createErr, instance) {
        var button = document.querySelector("#submit-button");
        button.addEventListener("click", function() {
          instance.requestPaymentMethod(function(
            requestPaymentMethodErr,
            payload
          ) {
            signup(this.props.signupClass, nounce);
          });
        });
      }
    );
  }

  signup(signupClass, nounce = "free") {
    const res = fetch("/tournaments/checkout/", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        nonce: nounce,
        tournamentId: getIdFromPath(),
        player1: getSelectedValueFromDropDownWithId("#player1"),
        player2: getSelectedValueFromDropDownWithId("#player2"),
        email: document.querySelector("#email").value,
        klasse: signupClass
      })
    })
      .then(function(res) {
        console.log(res);
      })
      .catch(function(res) {
        console.log(res);
      });
  }

  async componentDidMount() {
    try {
      const id = getIdFromPath();
      const players = await getJson("/api/players");
      const tournament = await getJson(`/api/tournaments/${id}`);
      this.setState({
        players: players,
        tournament: tournament,
        loading: false
      });
    } catch (err) {
      this.setState({ error: "Problem..." });
    }
  }

  render() {
    const {
      players,
      tournament: { name, classes },
      loading,
      signupClass = false
    } = this.state;
    if (loading) {
      return <Main>Loading...</Main>;
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
    return (
      <Main>
        <h1> {name}</h1>
        {renderSignup(players, correctClass.price)}
        <h4> Email for kvittering:</h4>
        <input type="text" id="email" />
        <h4>Klasse: {correctClass["class"]} </h4>
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
    log("player is truthy");
    return (
      <section>
        <h4> Spiller 1</h4>
        <select id="player1">{listPlayers(players)}</select>
        <h4> Spiller 2</h4>
        <select id="player2">{listPlayers(players)}</select>
      </section>
    );
  }
  log("player is falsy");
  return <div>Ingen spillere er registert</div>;
}

function getSelectedValueFromDropDownWithId(selector) {
  var dropdown = document.querySelector(selector);
  return dropdown.options[dropdown.selectedIndex].value;
}

function listPlayers(players) {
  return players.map(({ firstname, lastname, id }) => {
    return (
      <option key={id} value={id}>
        {firstname} {lastname}
      </option>
    );
  });
}

function getClassInfoFromClass(klass, classes) {
  const correctClass = classes.filter(klass1 => klass1["class"] === klass);
  if (correctClass.length != 1) {
    console.log("getClassInfoFromClass problem", correctClass, classes, klass);
  }
  return correctClass[0];
}
