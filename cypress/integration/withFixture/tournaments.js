import { validateTournamentPage } from "../tests/tournaments";
const deferred = require("../deferred");

describe("Tournaments", function() {
  it("Tournament list is displaying with info and length over 10", function() {
    cy.server();
    this.fetchTournamentsDeferred = deferred();
    cy.fixture("tournaments/future").then(tournaments => {
      this.fetchTournamentsDeferred.resolve({
        json() {
          return tournaments;
        },
        status: 200,
        ok: true
      });
    });

    cy.visit("/tournaments", {
      onBeforeLoad(win) {
        cy.stub(win, "fetch")
          .withArgs("/api/tournaments/future")
          .as("tournamentsResponse")
          .returns(this.fetchTournamentsDeferred.promise);
      }
    });

    // Every thing is done with SSR. Let run the same logic on the frontend to be able to stub the XHR requests
    cy.window().then(window => window.retryGetTournaments());
    cy.wait(3000);
    validateTournamentPage();
  });
});
