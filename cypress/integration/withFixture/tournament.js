describe("Tournament - Øst Beach Tour #1", function() {
  it("Finished Tournaments", function() {
    cy.server();
    cy.fixture("tournaments/tournament").as("tournamentJSON");
    cy.route("GET", "/api/tournaments/199", "@tournamentJSON").as(
      "tournamentResponse"
    );
    cy.route("GET", "/api/tournaments/199/results", "@tournamentResultJSON").as(
      "tournamentResultResponse"
    );

    cy.visit(`/tournaments/199`);

    //TODO:
    //cy.window().then(window => window.retryGetTournament());

    cy.wait("@tournamentResponse", { timeout: 30000 });
    cy.wait(16000);

    cy.get("h1").contains("Øst Beach Tour #1");
    cy.contains("Klasse K");
    cy.contains("Klasse M");
    cy.contains("Klasse GU15");
    cy.contains("Klasse JU15");
    cy.contains("Klasse GU19");
    cy.contains("Klasse JU19");
    cy.contains("Pris 200");
    cy.contains("Påmeldte 5 av 999");
    cy.contains("Påmeldte 8 av 999");
    cy.contains("Påmeldte 6 av 999");
    cy.contains("Påmeldte 4 av 999");
    cy.contains("Påmeldingsfrist");
    cy.contains("Start");
    cy.contains("Ikke oppgitt");
    cy.contains("Påmelding stengt");
    cy.contains("2018-05-05T00:00:00.000Z");
    cy.contains("2018-05-03T00:00:00.000Z");
    cy.contains("Resultat");
    cy.get("main > section > section > section > table > tbody").should(
      "have.length",
      6
    );
    cy.get("main > section > section > section > table > tbody > tr").should(
      "have.length",
      34
    );
  });

  it("Open Tournament", function() {
    cy.visit(`/tournaments/317`);
    cy.wait(16000);
    cy.contains("Seeding");
    cy.contains("Meld deg på");
    cy.contains("2018-08-27T00:00:00.000Z");
  });
});
