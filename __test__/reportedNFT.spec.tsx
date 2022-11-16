import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import Report from "../pages/admin/report/nft/index";
import { expect } from "@jest/globals";
import "@testing-library/jest-dom/extend-expect";

describe("Test Reported NFT Page", () => {
  test("Checks rendering of topic", () => {
    render(<Report />);
    const element = screen.findByText("Reported NFTs");
    expect(element).toBeInTheDocument;
  });

  test("Checks rendering of admin dashboard button", () => {
    render(<Report />);
    expect(screen.getByText("Admin Dashboard").closest("a")).toHaveAttribute(
      "href",
      "/admin"
    );
  });

  test("Checks rendering of Report", () => {
    render(<Report />);
    expect(screen.getByText("Reports")).toBeInTheDocument;
  });

  test("Checks rendering of reported NFTs from dropdown", () => {
    render(<Report />);
    const report = screen.getByText("Reports");
    fireEvent.click(report);
    expect(screen.getByText("Reported NFTs").closest("a")).toHaveAttribute(
      "href",
      "/admin/report/nft"
    );
  });

  test("Checks rendering of reported Users from dropdown", () => {
    render(<Report />);
    const report = screen.getByText("Reports");
    fireEvent.click(report);
    expect(screen.getByText("Reported Users").closest("a")).toHaveAttribute(
      "href",
      "/admin/report/users"
    );
  });

  test("Checks rendering of reported Collections from dropdown", () => {
    render(<Report />);
    const report = screen.getByText("Reports");
    fireEvent.click(report);
    expect(
      screen.getByText("Reported Collections").closest("a")
    ).toHaveAttribute("href", "/admin/report/collection");
  });

  test("Checks rendering of user table", () => {
    render(<Report />);
    const element = screen.getByText("NFT ID");
    expect(element).toBeInTheDocument;
  });
});
