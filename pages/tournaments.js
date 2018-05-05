import React from "react";
import debug from "debug";
import Link from "next/link";
import fetch from "isomorphic-unfetch";
import Main from "../components/Main"
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';

const log = debug("tournaments");

const styles = theme => ({
    tournamentTitle: {
        marginBottom: theme.spacing.unit * 2
    },
    tournamentPaper: theme.mixins.gutters({
        padding: theme.spacing.unit
    }),
    tournamentList: {
      listStyle: 'none',
      padding: 0,
      margin: 0
    },
    tournamentListItem: {
        marginBottom: theme.spacing.unit
    }
});

class Tournaments extends React.Component {
    constructor(props) {
        super(props);
        this.state = { players: [], loading: true };
    }

    async componentDidMount() {
        const res = await fetch("/api/tournaments/future");
        const statusCode = res.statusCode > 200 ? res.statusCode : false;
        const json = await res.json();

        this.setState({ tournaments: json, loading: false });
    }

    render() {
        const { tournaments = [], loading, error } = this.state;

        const { classes } = this.props;

        if (error) {
            return (
                <Main>
                    Noe feil skjedde :\ <p>{error}</p>
                </Main>
            );
        }
        if (loading) {
            return (
                <Main>
                    Loading...
                </Main>
            );
        }
        if (tournaments.length == 0) {
            return <div>Ingen turneringer er på plass enda, prøve igjen senere</div>;
        }

        console.log(tournaments);

        return (
            <Main>
                <Typography variant="display1" className={classes.tournamentTitle}>Turneringer</Typography>
                <ul className={classes.tournamentList}>
                    {tournaments.map( ({id, name, deadline, startDate, classesText}, tournament) => {
                        return (<li  className={classes.tournamentListItem}>
                            <Paper key={tournament} className={classes.tournamentPaper}>
                                <Typography variant="title">{name} {startDate}</Typography>
                                <p>
                                    <Typography variant="body2">Påmeldingsfrist: {deadline}</Typography>
                                </p>
                                <p>
                                    <Typography variant="body1">Klasser: {classesText}</Typography>
                                </p>

                                <Link href={"/tournament"} as={`/tournaments/${id}`}  >
                                    <Button color="primary">Påmeldte</Button>
                                </Link>
                                <Link href={"/signup"} as={`/signup/${id}`}  >
                                    <Button color="primary">Meld deg på</Button>
                                </Link>
                            </Paper>
                        </li>)
                    })}
                </ul>
            </Main>
        );
    }
}

function renderTableData(props) {
    const keys =  ["startDate", "deadline", "classesText"];
    return keys.map(key => <td key={key}>{props[key]}</td>);
}


export default withStyles(styles)(Tournaments);
