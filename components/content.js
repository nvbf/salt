import React from "react";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  contentContainer: {
    marginRight: "auto",
    marginLeft: "auto",
    padding: theme.spacing.unit,
    [theme.breakpoints.up("md")]: {
      maxWidth: "960px"
    }
  }
});

// content is basicly main
class Content extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <main className={classes.contentContainer}>{this.props.children}</main>
    );
  }
}

export default withStyles(styles)(Content);
