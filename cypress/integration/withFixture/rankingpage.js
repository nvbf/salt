import { validateResultPage } from "../tests/rankingpage";
const deferred = require("../deferred");

describe("Rankingpage", function() {
  it("Tournament list is displaying with info and length over 10", function() {
    cy.server();
    this.fetchTournamentsResultsDeferred = deferred();
    cy.fixture("ranking").then(results => {
      this.fetchTournamentsResultsDeferred.resolve({
        json() {
          return results;
        },
        status: 200,
        ok: true
      });
    });

    cy.visit("/ranking", {
      onBeforeLoad(win) {
        cy.stub(win, "fetch")
          .withArgs("/api/ranking")
          .returns(this.fetchTournamentsResultsDeferred.promise);
      }
    });

    // Every thing is done with SSR. Let run the same logic on the frontend to be able to stub the XHR requests
    cy.window().then(window => window.retryGetRanking());

    validateResultPage();
  });
});
