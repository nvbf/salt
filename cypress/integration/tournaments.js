describe("Tournaments", function() {
  it("Tournament list is displaying with info and length over 10", function() {
    cy.visit(`/tournaments`);
    cy.contains("Turneringer");
    cy.contains("Detaljer");
    cy.contains("Kampresultat");
    cy.contains("Påmeldingsfrist");
    cy.contains("Klasser");
    cy.contains("Meld deg på");

    cy.get("main > div > ul > li").should("have.length.above", 10);
  });
});
