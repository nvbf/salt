import { createStub } from "../../stub";

describe("Tournament - Finished", function() {
  it("Finished Tournaments", function() {
    cy.server();

    const tournamentStub = createStub({
      apiPath: "/api/tournaments/199",
      fixturePath: "tournaments/tournament-finished"
    });

    const resultStub = createStub({
      apiPath: "/api/tournaments/199/results",
      fixturePath: "tournaments/tournament-results"
    });

    cy.visit("/tournaments/199", {
      onBeforeLoad(win) {
        const stubbedFetch = cy.stub(win, "fetch");
        tournamentStub(stubbedFetch);
        resultStub(stubbedFetch);
      }
    });

    // TODO: this is not needed yet because we have not implemented SSR on
    // cy.window().then(window => window.retryGetTournament());

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
    cy.contains("05.05 00:00");
    cy.contains("03.05 00:00");
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
    cy.server();
    // intate the clock to 1.1.1970 so current date will always be in the future (https://docs.cypress.io/api/commands/clock.html#Usage)
    cy.clock();

    const tournamentStub = createStub({
      apiPath: "/api/tournaments/317",
      fixturePath: "tournaments/tournament-open-317"
    });

    const resultStub = createStub({
      apiPath: "/api/tournaments/317/results",
      fixturePath: "tournaments/tournament-result-317"
    });

    cy.visit("/tournaments/317", {
      onBeforeLoad(win) {
        const stubbedFetch = cy.stub(win, "fetch");

        tournamentStub(stubbedFetch);
        resultStub(stubbedFetch);
      }
    });

    cy.contains("Seeding");
    cy.contains("Meld deg på");
    cy.contains("27.08 00:00");
  });
});
