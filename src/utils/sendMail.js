const sendgrid = require("@sendgrid/mail");
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
const log = require("debug")("salt:src:utils:sendMail");

function sendMailTournament(
  receiver,
  tournament,
  klasse,
  price,
  transactionId
) {
  sendgrid.send(
    {
      to: receiver,
      from: "post@osvb.no",
      subject: `Påmelding registert - ${tournament.name}`,
      text: `Din betaling er registrert. \n\n 
      Du er påmeldt til ${tournament.name} i klassen ${klasse} \n\n
      Start Dato: ${tournament.startDate} \n\n 
      ${price ? `Pris: ${price}\n\n ` : ""}
      ${transactionId ? `Din referanse: ${transactionId}` : ""}
      `
    },
    function(err, json) {
      if (err) {
        log("ERROR: Klarte ikke sende mail til ", receiver);
      }
      log(`mail successfully sendt ${receiver}`);
    }
  );
}

module.exports = sendMailTournament;
