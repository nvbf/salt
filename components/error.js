import React from "react";
const debug = require("debug");
const log = debug("salt:error");

import { withStyles } from "material-ui/styles";
import Button from "material-ui/Button";

const styles = theme => ({});

class ErrorComponent extends React.Component {
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
