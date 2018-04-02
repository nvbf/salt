import debug from "debug";
import _ from "lodash";
import auth from "./auth";
const log = debug("index");
import { getSpreadsheetArea } from "./sheets";

const spreadsheetId = process.env.SHEET_ID;

export default {
  getRanking: getRanking,
  getPlayer: getPlayer
};

export async function getRanking(jwtClient) {
  const sheetNameA1Notation = "'ranking'!A:C";
  const result = await getSpreadsheetArea(
    jwtClient,
    spreadsheetId,
    sheetNameA1Notation
  );
  log(result);
  if (result) {
    const rankingList = result.values
      .slice(1)
      .map(row => ({ id: row[0], name: row[1], points: parseInt(row[2]) }));
    const sortedRankingList = _.sortBy(rankingList, ["points"]).reverse();
    return sortedRankingList;
  }
  return { error: "noe har skjedd" };
}

export async function getPlayers(jwtClient) {
  const sheetNameA1Notation = "'spillere'!A:G";
  const result = await getSpreadsheetArea(
    jwtClient,
    spreadsheetId,
    sheetNameA1Notation
  );
  log(result);

  if (result) {
    const persons = result.values
      .slice(1)
      .map(row => ({ id: row[0], name: row[4], birthday: row[6] }));
    return persons;
  }
  return { error: "ikke noe resultat fra 'databasen'" };
}

export async function getPlayer(jwtClient, id) {
  const sheetNameA1Notation = "'spillere'!A:G";
  const result = await getSpreadsheetArea(
    jwtClient,
    spreadsheetId,
    sheetNameA1Notation
  );
  log(result);

  if (result) {
    const person = result.values
      .slice(1)
      .filter(row => row[0] == id)
      .map(row => ({ id: row[0], name: row[3], birthday: row[6] }));
    return person[0];
  }
  return { error: "ikke noe resultat fra 'databasen'" };
}

export async function getTournaments(jwtClient) {
  const sheetNameA1Notation = "'turneringer'!A:L";
  const result = await getSpreadsheetArea(
    jwtClient,
    spreadsheetId,
    sheetNameA1Notation
  );
  if (result) {
    return result.values.slice(1).map(mapToTournament);
  }
  return { error: "noe har skjedd" };
}

export async function getTournament(jwtClient, id) {
  const result = getTournament(jwtClient, id);
  if (result) {
    const turnering = result.values.filter(tournament => tournament.id == id);
    return turnering[0];
  }
  return { error: "ikke noe resultat fra 'databasen'" };
}

export async function getSignupsFromTournament(sheetId) {
  const sheetNameA1Notation = "'signup'!A:L";
  const result = await getSpreadsheetArea(
    jwtClient,
    sheetId,
    sheetNameA1Notation
  );
  if (result) {
    return result.values.slice(1).map(mapToTournament);
  }
  return { error: "noe har skjedd" };
}

function mapToTournament(row) {
  log("row", row);
  return {
    id: row[0],
    timestamp: row[1],
    name: row[2],
    sted: row[3],
    startdate: row[4],
    starttime: row[5],
    endDate: row[6],
    endTime: row[7],
    tournamentType: row[8],
    price: row[9],
    deadline: row[10],
    sheetId: row[11]
  };
}
