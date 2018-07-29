export function validateResultPage() {
  cy.contains("Damer");
  cy.contains("Herrer");
  cy.get("tbody").should("have.length", 2);
  cy.get("tbody")
    .children()
    .should("have.length", 20);

  // Menn
  cy.get("button")
    .first()
    .click();

  cy.get("tbody")
    .first()
    .children()
    .should("have.length.above", 100);

  // Woman
  cy.get("button")
    .first()
    .click();

  cy.get("tbody")
    .last()
    .children()
    .should("have.length.above", 100);
}
