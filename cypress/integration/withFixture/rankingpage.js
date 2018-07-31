import { validateResultPage } from "../../asserts/rankingpage";
import { createStub } from "../../stub";

describe("Rankingpage", function() {
  it("Rankinglist", function() {
    cy.server();

    const rankingStub = createStub({
      apiPath: "/api/ranking",
      fixturePath: "ranking"
    });

    cy.visit("/ranking", {
      onBeforeLoad(win) {
        const stubbedFetch = cy.stub(win, "fetch");
        rankingStub(stubbedFetch);
      }
    });

    // Every thing is done with SSR. Let run the same logic on the frontend to be able to stub the XHR requests
    cy.window().then(window => window.retryGetRanking());

    validateResultPage();
  });
});
