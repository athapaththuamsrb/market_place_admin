const { Context } = require("wagmi");
describe("Overlay page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });
  it("should find our welcome page", () => {
    cy.get("h1").contains("Welcome to");
  });
  it("Explore button", async () => {
    // Find a link with an href attribute containing "Explore" and click it
    cy.get("h3").contains("Explore").click();

    // The new url should include "/explore-collections"
    cy.url().should("include", "/explore-collections");

    // The new page should contain an h1 with "About page"
    cy.get("h1").contains("Explore NFTs");
  });
  it("Create button", () => {
    // Find a link with an href attribute containing "Create" and click it
    cy.get("h3").contains("Create").click();
    // The new url should include "//create"
    cy.url().should("include", "/create");
    // The new page should contain an h1 with "About page"
    cy.get("main").contains("Connect your wallet");
  });
});
export {};
