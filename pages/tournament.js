import React from "react";
import fetch from "isomorphic-unfetch";
import Head from "../components/head";
import Nav from "../components/nav";
import debug from "debug";
import moment from "moment";
import Link from "next/link";
import { getJson } from '../src/utils/getJson'
import { getIdFromPath } from '../src/utils/getIdFromPath'

const log = debug("tournament");

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = { tournament: {}, loading: true };
  }
  
  async componentDidMount() {
    try {
      const id = getIdFromPath()
      const tournament = await getJson(`/api/tournaments/${id}`);
      if(tournament) {
        this.setState({ tournament: tournament, loading: false });
      } else {
        this.setState({ error: "No such tournament " });
      }
    } catch (error) {
      this.setState({ error });
    }
  }

  render() {
    const { tournament, loading, error } = this.state;
    log(tournament);
    if (error) {
      return <div>
          <Head title="Home" />
          <Nav />
          <p>Error:{error}</p>
        </div>
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
  log(`tournament: ${tournament}`)
  return (
      <h2>!{tournament.name}</h2>
      
  );
}

function renderSignupLink(tournament) {
  const { deadline, id } = tournament;
  const timeToDeadLine = moment(deadline, "DD.MM.YYYY").diff(moment.now());
  const signupAllowd = timeToDeadLine > 0;
  if (signupAllowd) {
    return (
      <Link href={`/signup/${id}`}>
        <a>Meld deg på</a>
      </Link>
    );
  }
}
