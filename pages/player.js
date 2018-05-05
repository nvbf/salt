import React from "react";
import fetch from "isomorphic-unfetch";
import Main from "../components/Main";
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Typography from 'material-ui/Typography';

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
        <Main>
          Loading...
        </Main>
      );
    }
    return (
      <Main>
        {renderPlayer(player)}
        {renderRanking(points)}
      </Main>
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
            <Typography variant="title">Resultater </Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Plassering</TableCell>
                        <TableCell>Turnering</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell numeric>Poeng</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {points.map(
                        ({ tournamentType, tournamentName, points, place }, index) => (
                            <TableRow key={index}>
                                <TableCell>{place}</TableCell>
                                <TableCell>{tournamentName}</TableCell>
                                <TableCell>{tournamentType}</TableCell>
                                <TableCell numeric>{points}</TableCell>
                            </TableRow>
                        )
                    )}
                </TableBody>
            </Table>
        </React.Fragment>);
}
function renderPlayer({ id, firstname, lastname, dateOfBith }) {
    if (!id) {
    return <div>Denne iden er ikke knyttet til en spiller</div>;
}
    return (
    <div>
    <Typography variant="headline">
    {firstname} {lastname}
    </Typography>
    <p>Fødselsår: {dateOfBith.split(".")[2]}</p>
    </div>
    );
}
