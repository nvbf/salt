import React from "react";
import fetch from "isomorphic-unfetch";

import Typography from "material-ui/Typography";
import { withStyles } from "material-ui/styles";
import Hidden from "material-ui/Hidden";

import { getPlayer } from "../src/api/";
import withRoot from "../src/withRoot";

import Main from "../components/Main";

const CircularJSON = require("circular-json");
const log = require("debug")("salt:player");

// Set some styles here later:
const styles = theme => ({
  topN: {
    fontWeight: "bold"
  }
});

class PlayerPage extends React.Component {
  constructor(props) {
    super(props);
    this.defaultState = {
      error: false,
      loading: true
    };

    this.retryGetPlayers = this.retryGetPlayers.bind(this);

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

  static async getInitialProps({ asPath }) {
    return await getPlayerAsProps(asPath);
  }

  retryGetPlayers() {
    this.setState(this.defaultState);
    this.setState(getPlayerAsProps(location.pathname));
  }

  render() {
    const { loading, error, player } = this.state;
    const { classes } = this.props;

    return (
      <Main error={error} loading={loading} retryHandler={this.retryGetPlayers}>
        {renderPlayer(player)}
      </Main>
    );
  }
}

function renderPlayer(player) {
  if (!player) {
    return <div>Denne iden er ikke knyttet til en spiller</div>;
  }
  return (
    <div>
      <Typography variant="headline">{player}</Typography>
    </div>
  );
}

async function getPlayerAsProps(pathname) {
  try {
    const path = pathname.split("/");
    const id = path[path.length - 1];
    log(`id is: ${id} ${pathname}`);
    const player = await getPlayer(id);
    return { loading: false };
  } catch (err) {
    log(err);
    return {
      loading: false,
      error: true,
      errorDetails: CircularJSON.stringify(err)
    };
  }
}

export default withRoot(withStyles(styles)(PlayerPage));
