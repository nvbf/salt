import { createStub } from "../stub";

describe("Signup", function() {
  it("Signup to an upen tournament ", function() {
    cy.server();

    const playerStub = createStub({
      apiPath: "/api/players",
      fixturePath: "players"
    });
    const tournamentStub = createStub({
      apiPath: "/api/tournaments/238",
      fixturePath: "tournaments/tournament"
    });

    const checkoutStub = createStub({
      apiPath: "/tournaments/checkout/",
      fixturePath: "tournaments/checkout"
    });

    cy.visit("/signup/238", {
      onBeforeLoad(win) {
        const stubbedFetch = cy.stub(win, "fetch");
        playerStub(stubbedFetch);
        tournamentStub(stubbedFetch);
        checkoutStub(stubbedFetch);
      }
    });

    cy.get("div[role=button]").click();
    cy.get("li[data-value=M][role=option]").click();
    cy.contains("button", "Neste").click();

    cy.get('input[placeholder="Finn Spiller 1"]').type(
      "Håkon Tveitan{downarrow}{enter}"
    );
    cy.get('input[placeholder="Finn Spiller 2"]').type(
      "Sindre Svendby{downarrow}{enter}"
    );

    cy.contains("button", "Neste").click();
    cy.contains("button", "Forstått").click();

    cy.wait(30);
    cy.get("input").type("test@test.com{enter}");
    cy.contains("button", "Neste").click();
    cy.wait(4700);

    const braintreeNumberSelector = "iframe#braintree-hosted-field-number";
    cy.get(braintreeNumberSelector).then($iframe => {
      cy.wait(2000);
      const $body = $iframe.contents().find("body");
      cy.wrap($body)
        .find("input[name=credit-card-number]")
        .type("4111");

      cy.wrap($body)
        .find("input[name=credit-card-number]")
        .type("1111");

      cy.wrap($body)
        .find("input[name=credit-card-number]")
        .type("1111");

      cy.wrap($body)
        .find("input[name=credit-card-number]")
        .type("1111");
    });

    const braintreeExperationDateSelector =
      "iframe#braintree-hosted-field-expirationDate";
    cy.get(braintreeExperationDateSelector).then($iframe => {
      const $body = $iframe.contents().find("body");
      cy.wrap($body)
        .find("input")
        .type("12");
      cy.wrap($body)
        .find("input")
        .type("22");
    });
    cy.wait(1000);
    cy.contains("button", "Purchase").click();

    cy.contains(
      "Betalingen er registert og dere er påmeldt til turneringen. Kvittering er sendt på mail"
    );
  });

  // TODO
  // it("Signup to an full tournament ", function() {
  //     cy.visit(`/signup/238`);
  // });

  // TODO
  // it("Signup to an closed tournament ", function() {
  //     cy.visit(`/signup/238`);
  // });
});
