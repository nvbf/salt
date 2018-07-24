describe("Player page", function() {
  it("Player page", function() {
    cy.visit("/players/2460");
    cy.contains("Sindre Øye Svendby");
  });
});
