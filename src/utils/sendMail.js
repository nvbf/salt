const sendgrid = require("sendgrid")(
  process.env.SENDGRID_USERNAME,
  process.env.SENDGRID_PASSWORD
);

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
      subject: `Påmelding registert -${tournament.name}`,
      text: `Din betaling er registrert. \n\n 
      Du er påmeldt til ${tournament.name} i klassen ${klasse} \n\n
      Start Dato: ${tournament.startDate} \n\n 
      Pris: ${price}
      din referanse: ${transactionId}
      
      `
    },
    function(err, json) {
      if (err) {
        console.log("ERROR: Klarte ikke sende mail til ", receiver);
      }
      console.log(json);
    }
  );
}

module.exports = sendMailTournament;
