import React from "react";
import { storiesOf } from "@storybook/react";
import moment from "moment";

import { TournamentList } from "../components/TournamentList";
import CssBaseline from "@material-ui/core/CssBaseline";
import {
  createMuiTheme,
  createGenerateClassName,
  MuiThemeProvider
} from "@material-ui/core/styles";
import orange from "@material-ui/core/colors/orange";
import green from "@material-ui/core/colors/green";

// A theme with custom primary and secondary color.
// It's optional.
const theme = createMuiTheme({
  palette: {
    primary: orange,
    secondary: green
  }
});

storiesOf("Tournaments", module).add("List", () => {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <TournamentList tournaments={getTournaments()} />
    </MuiThemeProvider>
  );
});

function getTournaments() {
  const deadLinePassed = moment()
    .subtract(10, "days")
    .format("DD.MM.YYYY");

  const deadLineYetToCome = moment()
    .add(10, "days")
    .format("DD.MM.YYYY");

  const endTimeWasYeasterday = moment()
    .subtract(1, "days")
    .format("DD.MM.YYYY");

  return [
    {
      id: 1,
      name: "Agder Beach Tour 2 (2017-04-17)",
      tournamentType: "RT Open",
      season: 2017,
      endDate: deadLineYetToCome,
      tournamentIdProfixio: 4320,
      shortNameProfixio: "",
      startDate: deadLineYetToCome,
      startTime: "09:00:00",
      endTime: deadLineYetToCome,
      deadline: deadLineYetToCome,
      tournamentDirector: "",
      email: "",
      phone: "",
      classesText: "K, M, GU19, JU19",
      classes: [
        { class: "K", price: 650, maxNrOfTeams: 999 },
        { class: "M", price: 650, maxNrOfTeams: 999 },
        { class: "GU19", price: 400, maxNrOfTeams: 999 },
        { class: "JU19", price: 400, maxNrOfTeams: 999 }
      ],
      description: '"Turneringen avholdes på løkka.',
      playerVenue: "",
      paymentInfo: ""
    },
    {
      id: 5,
      name: "Test Turnering ",
      tournamentType: "NT Masters",
      season: 2017,
      endDate: "20.05.2020",
      tournamentIdProfixio: 4329,
      classes: [
        { class: "K", price: 650, maxNrOfTeams: 999 },
        { class: "M", price: 650, maxNrOfTeams: 999 }
      ],
      shortNameProfixio: "",
      startDate: deadLineYetToCome,
      startTime: "00:00:00",
      endTime: "00:00:00",
      deadline: deadLinePassed,
      tournamentDirector: "",
      email: "",
      phone: "",
      classesText: "K, M",
      description: "",
      playerVenue: "",
      paymentInfo: ""
    },
    {
      id: 6,
      name: "CEV Sattelite Gøteorg (2017-04-16)",
      tournamentType: "CEV Sattelite",
      season: 2017,
      endDate: endTimeWasYeasterday,
      tournamentIdProfixio: -101,
      shortNameProfixio: "",
      startDate: endTimeWasYeasterday,
      startTime: "00:00:00",
      endTime: "00:00:00",
      deadline: endTimeWasYeasterday,
      tournamentDirector: "",
      email: "",
      phone: "",
      classesText: "Ingen",
      classes: [],
      description: '"Husk internasjonale poeng gjelder.',
      playerVenue: "",
      paymentInfo: ""
    }
  ];
}
