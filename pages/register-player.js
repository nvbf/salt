import React from "react";
import fetch from "isomorphic-unfetch";

import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import { withStyles } from "@material-ui/core/styles";
import Hidden from "@material-ui/core/Hidden";

import { getPlayer } from "../src/api/";
import withRoot from "../src/withRoot";

import Main from "../components/Main";

const CircularJSON = require("circular-json");
const log = require("debug")("salt:register-player");

// Set some styles here later:
const styles = theme => ({
  button: {
    margin: "16px"
  }
});

class RegisterPlayerPage extends React.Component {
  constructor(props) {
    super(props);
    this.defaultState = {
      error: false,
      loading: false
    };

    const {
      loading = this.defaultState.loading,
      error = this.defaultState.error,
      errorDetails = ""
    } = this.props;

    this.state = Object.assign({}, this.defaultState, {
      loading,
      error,
      errorDetails
    });
  }

  render() {
    const { classes } = this.props;
    const { error, loading } = this.state;
    return (
      <Main error={error} loading={loading} retryHandler={() => null}>
        <h1>Register ny spiller</h1>
        <p>
          Hvis du ikke finner deg eller partneren i spillerlisten, kan du
          registere ny spiller her{" "}
        </p>
        <List>
          <ListItem>
            <TextField
              id="firstname"
              type="text"
              required
              label="Fornavn"
              inputProps={{
                autoFocus: true,
                autoComplete: "given-name",
                name: "firstname",
                id: "firstname"
              }}
            />
          </ListItem>
          <ListItem>
            <TextField
              id="lastname"
              type="text"
              required
              label="Etternavn"
              inputProps={{
                required: true,
                autoComplete: "family-name",
                name: "firstname",
                id: "firstname"
              }}
            />
          </ListItem>
          <ListItem>
            <TextField
              id="birthday"
              type="date"
              required
              label="Fødselsdato"
              InputLabelProps={{ shrink: true }}
              inputProps={{
                required: true,
                autoComplete: "bday",
                name: "birthday",
                id: "birthday"
              }}
            />
          </ListItem>
        </List>
        <Button className={classes.button} variant="raised" color="primary">
          Lag spiller
        </Button>
      </Main>
    );
  }
}

export default withRoot(withStyles(styles)(RegisterPlayerPage));
