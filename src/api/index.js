import {
  apiGetRanking,
  apiGetPlayer,
  apiGetPlayers,
  apiGetTournament,
  apiGetTournaments,
  apiGetNorwegianTournaments
} from  "./json-api";

const log = require('debug')('salt:src:api')


export async function getRanking() {
  return await apiGetRanking();
}

export async function getPlayer(id) {
  return await apiGetPlayer(id);
}

export async function getPlayers() {
  const apiPlayers = await apiGetPlayers();
  log(`apiPlayers ${JSON.stringify(apiPlayers)}`)
  const players = mapToObject(apiPlayers)
  log(`players ${JSON.stringify(players)}`)
  const simplePlayers = players.map(({id, firstname, lastname}) => ({id, firstname, lastname}))
  return simplePlayers
}

export async function getTournament(id) {
  const apiTournament = await apiGetTournament(id);
  return mapToObject(apiTournament)
}

export async function getTournaments() {
  return await apiGetTournaments();
}

export async function getNorwegianTournaments() {
  return await apiGetNorwegianTournaments();
}

export function mapToObject(apiRes) {
  if(Array.isArray(apiRes)) {
    log(`mapping Array`)
    return apiRes.map(obj => mapToObject(obj))
  }

  const keys =Object.keys(apiRes)
  let tournament = {}
  keys.forEach(key => {
    if(mapping[key]) {
      if(typeof apiRes[key] === "object") {
        const result = mapToObject(apiRes[key]) 
        tournament[mapping[key]] = result 
      } else {
        tournament[mapping[key]] = apiRes[key]
      }
    } else {    
    }
  })
  return tournament
}

const mapping = {
  "TurneringsId": "id",
  "Navn": "name",
  "Turneringstype": "tournamentType",
  "Sesong": "season",
  "Finaledato": "endDate",
  "TurneringsIdProfixio": "tournamentIdProfixio",
  "KortnavnProfixio": "shortNameProfixio",
  "Startdato": "startDate",
  "Starttid": "startTime",
  "Sluttid": "endTime",
  "Pameldingsfrist": "deadline",
  "Turneringsleder": "tournamentDirector",
  "TurneringEpost": "email",
  "Telefon": "phone",
  "TurneringTlf": "phone",
  "KlasserTekst": "classesText",
  "Klasser": "classes",
  "Klasse": "class",
  "Pris": "price",
  "MaksLag": "maxNrOfTeams",
  "Memo": "description",
  "Spillested": "playerVenue",
  "Betalingsinfo": "paymentInfo",
  "PersonId": "id",
  "Fornavn": "firstname",
  "Etternavn": "lastname",
  "Adresse1": "adresseLine1",
  "Adresse2": "adresseLine2",
  "Posnr": "zipcode",
  "Possted": "city",
  "FDato": "dateOfBith",
  "Epost": "email",
}
