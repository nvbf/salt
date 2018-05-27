import React from "react";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";

import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";

import { getTournamentClass } from "../src/utils/getTournamentClass";

const styles = theme => ({
  errormessage: {
    padding: theme.spacing.unit
  }
});

class StepChooseClass extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentClass: "",
      full: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.onSetClass = this.onSetClass.bind(this);
  }

  handleChange(event) {
    const { tournamentClasses } = this.props;
    const fakeTournament = { classes: tournamentClasses };
    const klasse = event.target.value;
    const {
      teams: { lenght, maxNrOfTeams }
    } = getTournamentClass(fakeTournament, klasse);
    const full = length >= maxNrOfTeams;
    // de not set state on defaultValue
    if (klasse == " ") {
      return;
    }

    if (full) {
      this.setState({ currentClass: klasse, full: true });
      return;
    }
    if (klasse) {
      this.setState({ currentClass: klasse, full: false });
    }
  }

  onSetClass() {
    this.props.onSetClass(this.state.currentClass);
  }

  // TODO: bug or dressed up feature?
  //
  // after upgrade to @material-ui/core (v1.0)
  // we can not do this anymore, since (it looks like) the getDerivedStateFromProps
  // are called after setState on this component but before the
  // this.props.onSetClass is called, and therefor the props we recive
  // is not update and the state get reset back to our inital state

  // static getDerivedStateFromProps(nextProps, prevState) {
  //   prevState.currentClass = nextProps.currentClass;
  //   return prevState;
  // }

  render() {
    const { classes, tournamentClasses } = this.props;

    const { currentClass, full } = this.state;
    console.log("currentClas", currentClass);
    return (
      <>
        <TextField
          select
          InputLabelProps={{ shrink: true }}
          label="Klasse"
          onChange={this.handleChange}
          value={currentClass}
        >
          {listOptions(tournamentClasses)}
        </TextField>
        {full && (
          <Typography
            className={classes.errormessage}
            variant="body2"
            gutterBottom
          >
            Beklager, men denne klassen er full.
          </Typography>
        )}
        <div className={classes.actionsContainer}>
          <Button disabled={true} className={classes.button}>
            Tilbake
          </Button>
          <Button
            disabled={!currentClass || full}
            variant="raised"
            color="primary"
            onClick={this.onSetClass}
            className={classes.button}
          >
            Neste
          </Button>
        </div>
      </>
    );
  }
}

function listOptions(classes) {
  const classesAsOptions = classes.map(klass => {
    const klass1 = klass["class"];
    return (
      <MenuItem key={klass1} value={klass1}>
        {klass1}
      </MenuItem>
    );
  });
  return classesAsOptions;
}

export default withStyles(styles)(StepChooseClass);
