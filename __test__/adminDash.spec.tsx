import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import AdminDashboard from "../pages/admin/index";
import { expect } from "@jest/globals";
import "@testing-library/jest-dom/extend-expect";
import AdminMenu from "../components/Admin/AdminMenu";

describe("Test Admin Dashboard Page", () => {
  test("Checks rendering of topic", () => {
    render(<AdminDashboard />);
    const element = screen.findByText("Admin Dashboard");
    expect(element).toBeInTheDocument;
  });

  test("Checks rendering of admin panel button", () => {
    render(<AdminDashboard />);
    expect(screen.getByText("Admin Panel").closest("a")).toHaveAttribute(
      "href",
      "/admin/viewAdmin"
    );
  });

  test("Checks rendering of Report", () => {
    render(<AdminDashboard />);
    expect(screen.getByText("Reports")).toBeInTheDocument;
  });

  test("Checks rendering of reported NFTs from dropdown", () => {
    render(<AdminDashboard />);
    const report = screen.getByText("Reports");
    fireEvent.click(report);
    expect(screen.getByText("Reported NFTs").closest("a")).toHaveAttribute(
      "href",
      "/admin/report/nft"
    );
  });

  test("Checks rendering of reported Users from dropdown", () => {
    render(<AdminDashboard />);
    const report = screen.getByText("Reports");
    fireEvent.click(report);
    expect(screen.getByText("Reported Users").closest("a")).toHaveAttribute(
      "href",
      "/admin/report/users"
    );
  });

  test("Checks rendering of reported Collections from dropdown", () => {
    render(<AdminDashboard />);
    const report = screen.getByText("Reports");
    fireEvent.click(report);
    expect(
      screen.getByText("Reported Collections").closest("a")
    ).toHaveAttribute("href", "/admin/report/collection");
  });

  test("Checks rendering of user table", () => {
    render(<AdminDashboard />);
    const element = screen.getByText("Wallet Address");
    expect(element).toBeInTheDocument;
  });
});
