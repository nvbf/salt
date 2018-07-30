import { validateTournamentsListPage } from "../../asserts/tournaments";
import { createStub } from "../../stub";

describe("Tournaments", function() {
  it("Tournament list is displaying with info and length over 10", function() {
    cy.server();

    cy.clock(1532903909650);

    const tournamentsStub = createStub({
      apiPath: "/api/tournaments/future",
      fixturePath: "tournaments/future"
    });

    cy.visit("/tournaments", {
      onBeforeLoad(win) {
        const stubbedFetch = cy.stub(win, "fetch");
        tournamentsStub(stubbedFetch);
      }
    });

    // Every thing is done with SSR. Let run the same logic on the frontend to be able to stub the XHR requests
    cy.window().then(window => window.retryHandler());
    validateTournamentsListPage();
  });
});
