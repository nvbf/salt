import React from "react";
import debug from "debug";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";

import { TournamentListItem } from "../components/TournamentListItem";

const log = debug("TournamentsList");

const styles = theme => ({
  tournamentTitle: {
    marginBottom: theme.spacing.unit * 2
  },
  tournamentPaper: theme.mixins.gutters({
    padding: theme.spacing.unit
  }),
  tournamentList: {
    listStyle: "none",
    padding: 0,
    margin: 0
  },
  tournamentListItem: {
    marginBottom: theme.spacing.unit
  }
});

class TournamentList extends React.Component {
  render() {
    const { classes, tournaments = [] } = this.props;
    return (
      <React.Fragment>
        <Typography variant="display1" className={classes.tournamentTitle}>
          Turneringer
        </Typography>
        <Paper className={classes.tournamentPaper}>
          <ul className={classes.tournamentList}>
            {tournaments.map((tournament, index) => {
              const displayDivider = Boolean(index < tournaments.length - 1);
              return (
                <TournamentListItem
                  key={tournament.id}
                  data={Object.assign(
                    {},
                    tournament,
                    { index },
                    { displayDivider }
                  )}
                />
              );
            })}
          </ul>
        </Paper>
      </React.Fragment>
    );
  }
}

const styledTournamentList = withStyles(styles)(TournamentList);
export { styledTournamentList as TournamentList };
