import { createStub } from "../../stub";

describe("Player page", function() {
  it("Player page", function() {
    cy.server();

    const playerStub = createStub({
      apiPath: "/api/players/2460",
      fixturePath: "player"
    });

    const pointsStub = createStub({
      apiPath: "/api/points/2460",
      fixturePath: "player-points"
    });

    cy.visit("/players/2460", {
      onBeforeLoad(win) {
        const stubbedFetch = cy.stub(win, "fetch");
        playerStub(stubbedFetch);
        pointsStub(stubbedFetch);
      }
    });

    cy.window().then(window => window.retryHandler());

    cy.contains("Sindre Øye Svendby");
  });
});
