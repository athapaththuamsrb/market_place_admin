/// <reference types="cypress" />
describe("admin page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/admin");
  });
  it("should find  Admin Dashboard", () => {
    cy.get("main").contains("Admin Dashboard");
  });
  it("Admin Pannel button", async () => {
    // Find a link with an href attribute containing "Explore" and click it
    cy.get("h6").contains("Admin Pannel").click();

    // The new url should include "/explore-collections"
    cy.url().should("include", "/admin/viewAdmin");

    // The new page should contain an h1 with "About page"
    cy.get("main").contains("Admin Pannel");
  });
  it("Report button with Reported NFTs", () => {
    // Find a link with an href attribute containing "Create" and click it
    cy.get("h6").contains("Reports").click();
    cy.contains("a", "Reported NFTs").click();
    // The new url should include "//create"
    cy.url().should("include", "/admin/report/nft");
    // The new page should contain an h1 with "About page"
    cy.get("main").contains("Reported NFTs");
  });
  it("Report button with Reported Users", () => {
    // Find a link with an href attribute containing "Create" and click it
    cy.get("h6").contains("Reports").click();
    cy.contains("a", "Reported Users").click();
    // The new url should include "//create"
    cy.url().should("include", "/admin/report/user");
    // The new page should contain an h1 with "About page"
    cy.get("main").contains("Reported Users");
  });
  it("Report button with Reported Collections", () => {
    // Find a link with an href attribute containing "Create" and click it
    cy.get("h6").contains("Reports").click();
    cy.contains("a", "Reported Collections").click();
    // The new url should include "//create"
    cy.url().should("include", "/admin/report/collection");
    // The new page should contain an h1 with "About page"
    cy.get("main").contains("Reported Collections");
  });
});
export {};
