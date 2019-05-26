import React from "react";
import Main from "../components/Main";
import Link from "next/link";
import withRoot from "../src/withRoot";

import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

const styles = theme => ({
  paperContainer: {
    padding: theme.spacing.unit,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    p: {
      flexGrow: 1,
      backgroundColor: "red"
    }
  },

  buttonLink: {
    flexGrow: 0
  },

  description: {
    display: "block"
  }
});

class IndexPage extends React.Component {
  render() {
    const { classes } = this.props;

    const items = [
      {
        title: "Turneringer",
        description: "Påmeldte og påmelding for turneringer",
        linkText: "Vis turneringer",
        link: "/tournaments"
      },
      {
        title: "Resultater",
        description: "Se resultater fra de siste turneringene som har vært",
        linkText: "Se resultater",
        link: "/results"
      },
      {
        title: "Rankinglista",
        description: "Spillerrangering for 2019",
        linkText: "Se rankinglista!",
        link: "/ranking"
      }
    ];

    return (
      <Main>
        <Typography variant="display1" gutterBottom>
          Sandvolleyball i Norge
        </Typography>
        <p className="description">
          Her vil du kunne melde deg på Lokale, Regionale og Norges Tour for
          sesongen 2019.
        </p>

        <Grid container spacing={16}>
          {items.map((item, index) => {
            return (
              <Grid item key={index} xs={12} md={4}>
                <Paper className={classes.paperContainer} style={{display: "flex", flexDirection: 'column'}}>
                  <Typography variant="headline">{item.title}</Typography>
                  <p style={{flexGrow: 1}}>
                    <Typography variant="body1">{item.description}</Typography>
                  </p>
                  <Link href={item.link}>
                    <Button color="primary" className={classes.buttonLink}>
                      {item.linkText}
                    </Button>
                  </Link>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Main>
    );
  }
}

export default withRoot(withStyles(styles)(IndexPage));
