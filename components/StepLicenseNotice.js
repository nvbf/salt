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
  message: {
    pading: theme.spacing.unit
  }
});

class StepLicenseNotice extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentClass: "",
      full: false
    };

    this.handleChange = this.handleChange.bind(this);
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

  onAccept() {
    this.props.onAccept(this.state.currentClass);
  }

  render() {
    const { classes } = this.props;

    const { currentClass, full } = this.state;
    return (
      <>
        <Typography className={classes.message} variant="body" gutterBottom>
          Spillere som skal delta på turneringer i regi av NVBF er ansvarlige
          for å løse riktig lisens. Dersom gyldig lisens ikke kan fremvises ved
          turneringsstart kan man bli nektet å spille turneringen. For
          turneringer spilt uten gyldig lisens risikerer man tap av poeng og
          utestengelse. Status for din lisens kan du sjekke på{" "}
          <a href="https://minidrett.nif.no/"> MinIdrett </a>. For mer
          informasjon, se{" "}
          <a href="https://volleyball.no/lisens-2/">
            NVBF sine sider om sandvolleyballlisens.{" "}
          </a>
          NVBF har et forsikringsansvar ovenfor spillere som deltar i organisert
          konkurranse dette dekkes gjennom lisensen. <br />
          <br />Har noen problemer med å løse lisens, ta kontakt med:
          <br />{" "}
          <a href="mailto:Beate.sodal@volleyball.no">
            Beate.sodal@volleyball.no
          </a>{" "}
          / 95167416
          <br />{" "}
          <a href="mailto:eva.ofstaas@volleyball.no">
            eva.ofstaas@volleyball.no
          </a>{" "}
          / 90153508<br />
        </Typography>
        <div className={classes.actionsContainer}>
          <Button className={classes.button}>Tilbake</Button>
          <Button
            variant="raised"
            color="primary"
            onClick={this.onAccept}
            className={classes.button}
          >
            Forstått
          </Button>
        </div>
      </>
    );
  }
}

export default withStyles(styles)(StepLicenseNotice);
