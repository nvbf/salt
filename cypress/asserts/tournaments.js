export function validateTournamentsListPage() {
  cy.contains("Turneringer");

  const Lofoten = cy.get("main > div > ul > li").first();
  Lofoten.contains("Sluttplassering");
  // TODO: why can't I reuse Lofoten here?
  cy.get("main > div > ul > li")
    .first()
    .contains("Kampoppsett");

  cy.get("main > div > ul > li")
    .eq(3)
    .contains("Detaljer");

  cy.get("main > div > ul > li")
    .eq(3)
    .contains("Meld deg på");

  cy.get("main > div > ul > li")
    .eq(3)
    .contains("Klasser: GU15, GU17, GU19, JU15, JU17, JU19");

  cy.get("main > div > ul > li")
    .eq(3)
    .contains("Påmeldingsfrist: 30.07 12:00");

  cy.get("main > div > ul > li").should("have.length.above", 10);
}
