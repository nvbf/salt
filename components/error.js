import React from "react";

import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
const debug = require("debug");
const log = debug("salt:error");

const styles = theme => ({});

class ErrorComponent extends React.Component {
  componentDidMount() {
    window.retryHandler = this.props.retryHandler;
  }

  render() {
    const { error, errorDetails, retryHandler } = this.props;
    log(`Error ${error} ${errorDetails}`);
    return (
      <section>
        <h2>Error</h2>
        <p>
          Beklager, en feil har oppstått! Prøv igjen eller ring Sindre på
          93008598 og klag hvis du får denne feilen gjentatte ganger!
        </p>
        {retryHandler && <Button onClick={retryHandler}>Prøv Igjen </Button>}
        <div>
          <h4>Detaljer</h4>
          <pre>{errorDetails || "Ukjent Feil"}</pre>
        </div>
      </section>
    );
  }
}

export const Error = withStyles(styles)(ErrorComponent);
