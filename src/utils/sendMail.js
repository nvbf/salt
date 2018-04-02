const sendgrid  = require('sendgrid')(process.env.SENDGRID_USERNAME, process.env.SENDGRID_PASSWORD);


function sendMailTournament(receiver, tournament) {
  sendgrid.send({
    to:       receiver,
    from:     'post@osvb.no',
    subject:  `Påmelding registert -${tournament.name}`,
    text:     `Din betaling er registrert. \n\n Du er påmeldt til ${tournament.name} \n\n Start Dato: ${tournament.startDate}`
  }, function(err, json) {
    if (err) {
      console.log('ERROR: Klarte ikke sende mail til ', receiver);
    }
    console.log(json);
  });
}


module.exports = sendMailTournament