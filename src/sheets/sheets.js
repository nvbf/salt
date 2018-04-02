import auth from "./auth";
import debug from "debug";
import Promise from "bluebird";

const google = require("googleapis");
const log = debug("sheets");

const sheets = google.sheets("v4");

export async function getLastRowInSpreadsheet(
  jwtClient,
  spreadsheetId,
  sheetNameA1Notation
) {
  const response = await getSpreadsheetArea(
    jwtClient,
    spreadsheetId,
    sheetNameA1Notation
  );
  const length = response.values.length;
  return response.values[length - 1];
}

export async function getFirstValueInLastRowInSpreadshhet(
  jwtClient,
  spreadsheetId,
  sheetNameA1Notation
) {
  const row = await getLastRowInSpreadsheet(
    jwtClient,
    spreadsheetId,
    sheetNameA1Notation
  );
  const value = row[0];
  return value;
}

export async function getSpreadsheetArea(
  jwtClient,
  spreadsheetId,
  sheetNameA1Notation
) {
  return new Promise((resolve, reject) => {
    try {
      let sheetName = sheetNameA1Notation;
      sheets.spreadsheets.values.get(
        {
          auth: jwtClient,
          spreadsheetId: spreadsheetId,
          range: sheetName
        },
        (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response);
          }
        }
      );
    } catch (e) {
      reject(e);
    }
  });
}

export async function append(
  jwtClient,
  spreadsheetId,
  sheetNameA1Notation,
  content
) {
  const appendToSheet = Promise.promisify(sheets.spreadsheets.values.append);
  const data = {
    range: sheetNameA1Notation,
    values: content
  };
  const result = await appendToSheet({
    auth: jwtClient,
    spreadsheetId: spreadsheetId,
    range: sheetNameA1Notation,
    valueInputOption: "USER_ENTERED",
    resource: data
  });
  return result;
}
