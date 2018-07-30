import { createStub } from "../../stub";
import moment from "moment";

/**
 * This test goes against braintree on the server side, so this could be more flaky then the other test,
 * but we really want to test the signup process as production like as possible.
 * So at this point in time, we believe this is the correct decision
 */
describe("Signup", function() {
  it("Signup to an open tournament ", function() {
    cy.server();

    const playerStub = createStub({
      apiPath: "/api/players",
      fixturePath: "players"
    });
    const tournamentStub = createStub({
      apiPath: "/api/tournaments/238",
      fixturePath: "signups/signup-tournament",
      handleRes: res => {
        res.deadline = moment().add(1, "days");
        return res;
      }
    });

    const checkoutStub = createStub({
      apiPath: "/tournaments/checkout/",
      fixturePath: "signups/checkout-ok"
    });

    cy.visit("/signup/238", {
      onBeforeLoad(win) {
        const stubbedFetch = cy.stub(win, "fetch");
        playerStub(stubbedFetch);
        tournamentStub(stubbedFetch);
        checkoutStub(stubbedFetch);
      }
    });

    //Choose class to participate in
    cy.get("div[role=button]").click();
    cy.get("li[data-value=M][role=option]").click();
    cy.contains("button", "Neste").click();

    // Choose players to signup
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
  it("Signup to an closed tournament", function() {
    cy.server();

    const playerStub = createStub({
      apiPath: "/api/players",
      fixturePath: "players"
    });
    const tournamentStub = createStub({
      apiPath: "/api/tournaments/238",
      fixturePath: "signups/signup-tournament",
      handleRes: res => {
        res.deadline = moment().subtract(1, "days");
        return res;
      }
    });

    cy.visit("/signup/238", {
      onBeforeLoad(win) {
        const stubbedFetch = cy.stub(win, "fetch");
        playerStub(stubbedFetch);
        tournamentStub(stubbedFetch);
      }
    });

    cy.contains("Påmeldinga er stengt");
  });

  it("Signup to an full tournament ", function() {
    const playerStub = createStub({
      apiPath: "/api/players",
      fixturePath: "players"
    });
    const tournamentStub = createStub({
      apiPath: "/api/tournaments/238",
      fixturePath: "signups/signup-tournament",
      handleRes: res => {
        res.deadline = moment().add(1, "days");
        // female class
        res.classes[0].maxNrOfTeams = 7;
        return res;
      }
    });

    cy.visit("/signup/238", {
      onBeforeLoad(win) {
        const stubbedFetch = cy.stub(win, "fetch");
        playerStub(stubbedFetch);
        tournamentStub(stubbedFetch);
      }
    });

    cy.get("div[role=button]").click();
    cy.get("li[data-value=K][role=option]").click();
    1;
    cy.contains("Beklager, men denne klassen er full.");
  });
});
