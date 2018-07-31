describe("Frontpage", function() {
  it("Have 3 button", function() {
    cy.visit(`/`);
    cy.get("button").should("have.length", 3);
  });
});
