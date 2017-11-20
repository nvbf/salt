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

    this.setState({ player: json, loading: false });
  }

  render() {
    const { player, loading } = this.state;
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
      </div>
    );
  }
}

function renderPlayer({ id = 0, name, birthday }) {
  if (!id) {
    return <div>Denne iden er ikke knyttet til en spiller</div>;
  }
  return (
    <div>
      <h2>{name}</h2>
      <p>Bursdag: {birthday}</p>
    </div>
  );
}
