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

  const tournamentList = "main > div > ul > li";
  cy.get(tournamentList).should("have.length", 18);

  // Open filter panel
  const filterButton = "main > div:first() > button";
  cy.get(filterButton).click();

  // filter on NT Open
  const ntOpenFilterButton = "main > div:nth(1) div > div:nth(4)";
  cy.get(ntOpenFilterButton).click();
  cy.get(tournamentList).should("have.length", 3);

  // remove filter on NT Open
  cy.get(ntOpenFilterButton).click();
  cy.get(tournamentList).should("have.length", 18);

  // apply region filter
  const regionOstFilterButton = "main > div:nth(1) div > div:nth(8)";
  cy.get(regionOstFilterButton).click();
  cy.get(tournamentList).should("have.length", 9);

  // apply more then one filter
  const regionMoreFilterButton = "main > div:nth(1) div > div:nth(7)";
  cy.get(regionMoreFilterButton).click();
  cy.get(tournamentList).should("have.length", 10);

  cy.contains("8 turneringer ble filtrert bort");
}
