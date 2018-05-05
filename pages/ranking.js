import React from "react";
import debug from "debug";
import Link from "next/link";
import fetch from "isomorphic-unfetch";
import Main from "../components/Main";
import { LoadingPage } from "../components/loading-page";
import { ErrorPage } from "../components/error-page";
import { getJson } from "../src/utils/getJson";
import { withStyles } from 'material-ui/styles';

import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';

const log = debug("players");

const styles = theme => ({
    title: {
      marginBottom: theme.spacing.unit * 3
    },
   showAllButton: {
       marginTop: theme.spacing.unit,
       marginLeft: 'auto',
       marginRight: 'auto'
   }
});

class RankingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        male: [],
        allMales: false,
        female: [],
        allFemales: false,
        loading: true
    };
  }

  async componentDidMount() {
    const { male, female } = await getJson("/api/ranking");
    this.setState({ male, female, loading: false });
  }

  render() {
    let { male = [], female = [], loading, error, allFemales, allMales } = this.state;
    if (error) return <ErrorPage error={error} />;
    if (loading) return  (<LoadingPage />)

    if (!allMales) male = male.slice(0, 10);
    if (!allFemales) female = female.slice(0, 10);

    const { classes } = this.props;

    return (
        <Main>
            <Typography variant="display1" className={classes.title}>Spillerranking 2018</Typography>
            <Grid container spacing={24} alignItems="top" alignContent="center">
                <Grid item xs={12} md={6}>
                    <Typography variant="title">Damer</Typography>
                    {renderPlayers(female)}
                    {!allFemales && <Button variant="raised" color="primary" className={classes.showAllButton} onClick={() => {
                        this.setState({allFemales: true});
                    }}>Vis Alle</Button>}
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="title">Herrer</Typography>
                    {renderPlayers(male)}
                    {!allMales && <Button variant="raised" color="primary" className={classes.showAllButton}  onClick={() => {
                        this.setState({allMales: true});
                    }}>Vis Alle</Button>}
                </Grid>
            </Grid>
      </Main>
    );
  }
}

function renderPlayers(players) {
  if (players.length > 1) {
    return  <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Spiller</TableCell>
                        <TableCell numeric>Poeng</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {listTournaments(players)}
                </TableBody>
         </Table>;
  }
  return <div>Ingen spillere er registert</div>;
}

function listTournaments(players) {
  return players.map(({ id, name, sum }, key) => {
    return (
      <TableRow key={key}>
        <TableCell><Link href={`/players/${id}`}>
          <a color="primary">
            {name}
          </a>
        </Link>
        </TableCell>
        <TableCell numeric>{sum}</TableCell>
      </TableRow>
    );
  });
}

export default withStyles(styles)(RankingPage)