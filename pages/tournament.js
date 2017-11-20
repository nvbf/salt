import React from "react";
import fetch from "isomorphic-unfetch";
import Head from "../components/head";
import Nav from "../components/nav";

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = { tournament: [], loading: true };
  }

  async componentDidMount() {
    const path = location.pathname.split("/");
    const id = path[path.length - 1];
    const res = await fetch(`/api/tournaments/${id}`);
    const statusCode = res.statusCode > 200 ? res.statusCode : false;
    const json = await res.json();

    this.setState({ tournament: json[1], loading: false });
  }

  render() {
    const { tournament, loading } = this.state;
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

function renderTournament({
  id,
  name,
  place,
  startdate,
  starttime,
  endDate,
  endTime,
  tournamentType,
  price
}) {
  if (!id) {
    return <div>Denne iden er ikke knyttet til en turnering</div>;
  }
  return (
    <div>
      <h2>{name}</h2>
      <ul>
        <li>place: {place}</li>
        <li>startdate: {startdate}</li>
        <li>starttime: {starttime}</li>
        <li>endDate: {endDate}</li>
        <li>tournamentType: {tournamentType}</li>
        <li>price: {price}</li>
      </ul>
    </div>
  );
}
