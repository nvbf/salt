const sheets = require("../sheets/");
import auth from "../sheets/auth";

export async function getRanking() {
  const jwtClient = await auth();
  return sheets.getRanking(jwtClient);
}

export async function getPlayer(id) {
  const jwtClient = await auth();
  return sheets.getPlayer(jwtClient, id);
}

export async function getTournament(id) {
  const jwtClient = await auth();
  return sheets.getTournament(jwtClient, id);
}

export async function getTournaments() {
  const jwtClient = await auth();
  return sheets.getTournaments(jwtClient);
}
