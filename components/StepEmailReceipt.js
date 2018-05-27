import React from "react";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

const styles = {};

class StepEmailReceipt extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      emailAddress: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.onSetReceiptEmail = this.onSetReceiptEmail.bind(this);
  }

  handleChange(event) {
    // de not set state on defaultValue
    if (event.target.value == "") {
      return;
    }
    this.setState({ emailAddress: event.target.value });
  }

  onSetReceiptEmail() {
    this.props.onSetReceiptEmail(this.state.emailAddress);
  }

  // static getDerivedStateFromProps(nextProps, prevState) {
  //   prevState.emailAddress = nextProps.receiptEmail;
  //   return prevState;
  // }

  render() {
    const { classes, onGoBack } = this.props;

    const { emailAddress } = this.state;
    const isValid = validateEmail(emailAddress);

    return (
      <div>
        <TextField
          id="name"
          label="Mottaker Epost"
          value={this.state.emailAddress}
          onChange={this.handleChange}
          margin="normal"
          type="email"
        />
        <div className={classes.actionsContainer}>
          <div>
            <Button
              disabled={false}
              onClick={onGoBack}
              className={classes.button}
            >
              Tilbake
            </Button>
            <Button
              disabled={!isValid}
              variant="raised"
              color="primary"
              onClick={this.onSetReceiptEmail}
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

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export default withStyles(styles)(StepEmailReceipt);
