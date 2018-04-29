import React from "react";
import fetch from "isomorphic-unfetch";
import Head from "../components/head";
import Nav from "../components/nav";

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = { player: [], loading: true };
  }

  async componentDidMount() {
    const path = location.pathname.split("/");
    const id = path[path.length - 1];
    const res = await fetch(`/api/players/${id}`);
    const statusCode = res.statusCode > 200 ? res.statusCode : false;
    const json = await res.json();

    const resPoints = await fetch(`/api/points/${id}`);
    const points = await resPoints.json();
    this.setState({ player: json, points, loading: false });
  }

  render() {
    const { player, loading, points } = this.state;
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
        {renderPlayer(player)}
        {renderRanking(points)}
      </div>
    );
  }
}

function renderRanking(points) {
  if (points.length === 0) {
    return (
      <React.Fragment>
        <h3>Ranking </h3>
        <p>Ingen turneringer registert </p>
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      <h3>Ranking </h3>
      <ul>
        {points.map(({ tournamentType, tournamentName, points, place }) => (
          <li>
            {place}.plass {tournamentName} ({tournamentType}) - {points} poeng{" "}
          </li>
        ))}
      </ul>
    </React.Fragment>
  );
}
function renderPlayer({ id, firstname, lastname, dateOfBith }) {
  if (!id) {
    return <div>Denne iden er ikke knyttet til en spiller</div>;
  }
  return (
    <div>
      <h2>
        {firstname} {lastname}
      </h2>
      <p>Fødselsår: {dateOfBith.split(".")[2]}</p>
    </div>
  );
}
