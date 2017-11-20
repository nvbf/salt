import debug from "debug";
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
    return result.values
      .slice(1)
      .map(row => ({ id: row[0], name: row[1], points: row[2] }));
  }
  return { error: "noe har skjedd" };
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
  const sheetNameA1Notation = "'turneringer'!A:I";
  const result = await getSpreadsheetArea(
    jwtClient,
    spreadsheetId,
    sheetNameA1Notation
  );
  if (result) {
    return result.values.map(mapToTournament);
  }
  return { error: "noe har skjedd" };
}

export async function getTournament(jwtClient, id) {
  const sheetNameA1Notation = "'turneringer'!A:I";
  const result = await getSpreadsheetArea(
    jwtClient,
    spreadsheetId,
    sheetNameA1Notation
  );
  if (result) {
    const turnering = result.values
      .slice(1)
      .filter(row => row[0] == id)
      .map(mapToTournament);
    return turnering[0];
  }
  return { error: "ikke noe resultat fra 'databasen'" };
}

function mapToTournament(row) {
  return {
    id: row[0],
    timestamp: row[1],
    name: row[2],
    place: row[3],
    startdate: row[4],
    starttime: row[5],
    endDate: row[6],
    endTime: row[7],
    tournamentType: row[8],
    price: row[9]
  };
}
