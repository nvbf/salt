import React from "react";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";

import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Select from "@material-ui/core/Select";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";

const styles = {};

class StepChooseClass extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentClass: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.onSetClass = this.onSetClass.bind(this);
  }

  handleChange(event) {
    // de not set state on defaultValue
    if (event.target.value == " ") {
      return;
    }
    this.setState({ currentClass: event.target.value });
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

    const { currentClass } = this.state;
    console.log("currentClas", currentClass);
    return (
      <div>
        <Typography>
          <InputLabel htmlFor="klasse">Klasse</InputLabel>
          <Select
            value={currentClass}
            onChange={this.handleChange}
            inputProps={{
              name: "klasse",
              id: "klasse"
            }}
          >
            {listOptions(tournamentClasses)}
          </Select>
        </Typography>
        <div className={classes.actionsContainer}>
          <div>
            <Button disabled={true} className={classes.button}>
              Tilbake
            </Button>
            <Button
              disabled={!currentClass}
              variant="raised"
              color="primary"
              onClick={this.onSetClass}
              className={classes.button}
            >
              Neste
            </Button>
          </div>
        </div>
      </div>
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
