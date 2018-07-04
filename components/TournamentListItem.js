import React from "react";
import debug from "debug";
import Link from "next/link";
import fetch from "isomorphic-unfetch";
import moment from "moment";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

import Main from "../components/Main";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  tournamentListItem: {
    marginBottom: theme.spacing.unit
  },
  deadLineItem: {
    marginTop: "16px"
  }
});

class TournamentListItem extends React.Component {
  render() {
    const {
      data: {
        tournamentId,
        startDate,
        endDate,
        deadline,
        classesAsText,
        shortNameProfixio,
        name,
        displayDivider
      },
      classes
    } = this.props;

    return (
      <li className={classes.tournamentListItem}>
        <Grid container spacing={16}>
          <Grid item xs={2} md={1}>
            <List
              classes={{
                padding: classes.padding
              }}
            >
              <ListItem dense>{renderDate(startDate)}</ListItem>
            </List>
          </Grid>
          <Grid item xs={10} md={11}>
            <List
              classes={{
                padding: classes.padding
              }}
            >
              <ListItem dense>
                <Typography noWrap variant="title">
                  {name}
                </Typography>
              </ListItem>
              {isTournamentDateOver(endDate) && (
                <ListItem dense>
                  <Typography variant="body2">
                    Påmeldingsfrist: {moment(deadline).format("DD.MM hh:mm")}
                  </Typography>
                </ListItem>
              )}
              {isTournamentDateOver(endDate) && classesAsText && (
                <ListItem dense>
                  <Typography variant="body1">
                    Klasser: {classesAsText.split(",").join(", ")}
                  </Typography>
                </ListItem>
              )}
            </List>
            {renderTournamentDetailLink(tournamentId, endDate)}
            {renderSignupLink(tournamentId, deadline)}
            {renderTournamentScheduleLink(shortNameProfixio, endDate)}
          </Grid>
        </Grid>
        {displayDivider && <Divider />}
      </li>
    );
  }
}

function renderDate(date) {
  moment.locale("nb");
  const momentDate = moment(date);
  const mon = momentDate.format("MMMM");
  const dateInMonth = momentDate.format("DD");

  return (
    <div>
      <Typography variant="title">{dateInMonth}</Typography>
      <Typography variant="subheading">{mon}</Typography>
    </div>
  );
}

function renderTournamentScheduleLink(shortNameProfixio, endDate) {
  if (shortNameProfixio && isTournamentDateOver(endDate)) {
    return (
      <a href={`https://www.profixio.com/matches/${shortNameProfixio}`}>
        <Button color="primary">Kampresultater</Button>
      </a>
    );
  }
  if (shortNameProfixio) {
    return (
      <a href={`https://www.profixio.com/matches/${shortNameProfixio}`}>
        <Button color="primary">Kampoppsett</Button>
      </a>
    );
  }
}

function renderTournamentDetailLink(id, endDate) {
  if (isTournamentDateOver(endDate)) {
    return (
      <Link href={"/tournament"} as={`/tournaments/${id}`}>
        <Button color="primary">Detaljer</Button>
      </Link>
    );
  } else {
    return (
      <Link href={"/tournament"} as={`/tournaments/${id}`}>
        <Button color="primary">Sluttplassering</Button>
      </Link>
    );
  }
}

function renderSignupLink(id, deadline) {
  const timeToDeadLine = moment(deadline)
    .endOf("day")
    .diff(moment.now());
  const signupAllowd = timeToDeadLine > 0;
  if (signupAllowd) {
    // TOOD: client_token do not work when client side rendering, needs to be fixed.
    // until that is fixed this is an a tag and not a Link tag.
    return (
      <a href={`/signup/${id}`}>
        <Button color="primary">Meld deg på</Button>
      </a>
    );
  }
  return null;
}

function isTournamentDateOver(endDate) {
  return (
    moment(endDate)
      .endOf("day")
      .diff(moment.now()) > 0
  );
}

const withS = withStyles(styles)(TournamentListItem);
export { withS as TournamentListItem };
