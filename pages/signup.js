import React from "react";
import debug from "debug";
import Link from "next/link";
import fetch from "isomorphic-unfetch";
import Head from "../components/head";
import Nav from "../components/nav";
import { getIdFromPath } from "../src/utils/getIdFromPath";
import { getJson } from "../src/utils/getJson";

const dropin = require("braintree-web-drop-in");

const log = debug("players");

export default class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = { players: [], tournament: {}, loading: true };
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

  componentDidUpdate(prevProps, prevState) {
    if (this.state.players.length > 0 && prevState.players.length == 0) {
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
              const res = fetch("/tournaments/checkout/", {
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify({
                  nonce: payload.nounce,
                  tournamentId: getIdFromPath(),
                  player1: getSelectedValueFromDropDownWithId("#player1"),
                  player2: getSelectedValueFromDropDownWithId("#player2"),
                  email: document.querySelector("#email").value,
                  klasse: "1"
                })
              })
                .then(function(res) {
                  console.log(res);
                })
                .catch(function(res) {
                  console.log(res);
                });
            });
          });
        }
      );
    }
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
    const { players, tournament, loading } = this.state;
    log("tournament", tournament);
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
        <h1> {tournament.name}</h1>
        {renderSignup(players)}
      </div>
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
        <h4> Email for kvittering:</h4>
        <input type="text" id="email" />
        <div id="dropin-container" />
        <button id="submit-button">Betale</button>
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
