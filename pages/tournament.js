import React from "react";
import fetch from "isomorphic-unfetch";
import Head from "../components/head";
import Nav from "../components/nav";
import debug from "debug";
import moment from "moment";
import Link from "next/link";

const log = debug("tournament");

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = { tournament: {}, loading: true };
  }
  async componentDidMount() {
    const path = location.pathname.split("/");
    log("path", path);
    const id = path[path.length - 1];
    log("id", id);
    const res = await fetch(`/api/tournaments/${id}`);
    const statusCode = res.statusCode > 200 ? res.statusCode : false;
    const json = await res.json();
    log("json", json);
    this.setState({ tournament: json[0], loading: false });
  }

  render() {
    const { tournament, loading, error } = this.state;
    log(tournament);
    if (error) {
      return (
        <div>
          <Head title="Home" />
          <Nav />
          error...
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
  const {
    id,
    name,
    sted,
    startdate,
    starttime,
    endDate,
    endTime,
    tournamentType,
    price,
    deadline
  } = tournament;
  if (!id) {
    return <div>Denne iden er ikke knyttet til en turnering</div>;
  }
  return (
    <div>
      <h2>{name}</h2>
      <ul>
        <li>sted: {sted}</li>
        <li>startdate: {startdate}</li>
        <li>starttime: {starttime}</li>
        <li>endDate: {endDate}</li>
        <li>tournamentType: {tournamentType}</li>
        <li>price: {price}</li>
        <li>deadline: {deadline}</li>
      </ul>
      {renderSignupLink(tournament)}
    </div>
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
