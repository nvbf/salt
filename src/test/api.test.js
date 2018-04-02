import { mapTotournamentObject} from '../api/index';

const apiRes = { "TurneringsId": 1,
"Navn": "Agder Beach Tour 2 (2017-04-17)",
"Turneringstype": "RT Open",
"Sesong": 2017,
"Finaledato": "17.04.2017",
"TurneringsIdProfixio": 0,
"KortnavnProfixio": "",
"Startdato": "15.04.2017",
"Starttid": "09:00:00",
"Sluttid": "09:00:00",
"Pameldingsfrist": "10.04.2017",
"Turneringsleder": "",
"TurneringEpost": "",
"TurneringTlf": "",
"KlasserTekst": "K, M, GU19, JU19, GU15, GU21, JU15, JU21",
"Klasser": [
{
"Klasse": "K",
"Pris": 650,
"MaksLag": 999
},
{
"Klasse": "M",
"Pris": 650,
"MaksLag": 999
},
{
"Klasse": "GU19",
"Pris": 400,
"MaksLag": 999
},
{
"Klasse": "JU19",
"Pris": 400,
"MaksLag": 999
},
{
"Klasse": "GU15",
"Pris": 0,
"MaksLag": 999
},
{
"Klasse": "GU21",
"Pris": 0,
"MaksLag": 999
},
{
"Klasse": "JU15",
"Pris": 0,
"MaksLag": 999
},
{
"Klasse": "JU21",
"Pris": 0,
"MaksLag": 999
}
],
"Memo": "Turneringen avholdes på løkka. Mer info kommer senere",
"Spillested": "",
"Betalingsinfo": ""
}

test('Check if tournamentObject is valid', () => {
    const tournament = mapTotournamentObject(apiRes)
    expect(tournament['classes'][3]['class']).toBe("JU19")
});

test('Check if tournamentObject is valid 2', () => {
    const tournament = mapTotournamentObject(apiRes)
    expect(tournament.lenght).toBe(apiRes.lenght)
});

test('Check if tournamentObject is valid 3', () => {
    const tournament = mapTotournamentObject(apiRes)
    expect(tournament['deadline']).toBe('10.04.2017')
});



