describe("Rankingpage", function() {
  it("Have 3 button", function() {
    cy.visit(`/ranking`);

    cy.contains("Damer").contains("Herrer");
    cy
      .get("table")
      .children()
      .should("have.length", 11);
    cy.get();
  });
});
