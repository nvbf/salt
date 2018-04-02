import React from "react";
import debug from "debug";
import Link from "next/link";
import fetch from "isomorphic-unfetch";
import Head from "../components/head";
import Nav from "../components/nav";
import { getIdFromPath } from "../src/utils/getIdFromPath";
import { getJson } from "../src/utils/getJson";

const  dropin = require('braintree-web-drop-in');
import { gateway }  from './../src/utils/gateway.js';

const log = debug("players");

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = { players: [], tournament: {}, loading: true };
  }

  static async getInitialProps({ query }) {
    return new Promise((resolve, reject) => {
      gateway.clientToken.generate({}, function (err, response) {
        if(err) {
          reject(err)
        } else {
          resolve(response.clientToken);
        }
      });
    })
  }

  async componentDidMount() {
    try {
      var button = document.querySelector('#submit-button');

      dropin.create({
        authorization: this.props.token,
        container: '#dropin-container'
      }, function (createErr, instance) {
        button.addEventListener('click', function () {
          instance.requestPaymentMethod(function (requestPaymentMethodErr, payload) {
            // Submit payload.nonce to your server
          });
        });
      });
            const id = getIdFromPath();
      const players = await getJson("/api/players");
      const tournament = await getJson(`/api/tournaments/${id}`);
      this.setState({ players: players, tournament: tournament, loading: false });
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
        <select id="player1" >{listPlayers(players)}</select>
        <h4> Spiller 2</h4>
        <select id="player2" >{listPlayers(players)}</select>
        <div id="dropin-container"></div>
        <button id="submit-button">Request payment method</button>
      </section>
      
      )
  }
  log("player is falsy");
  return <div>Ingen spillere er registert</div>;
}

function listPlayers(players) {
  return players.map(({ firstname, lastname,  id }) => {
    return <option key={id}>{firstname} {lastname}</option>;
  });
}
