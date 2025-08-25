// __tests__/components/Navbar.test.js 
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Navbar from "@/components/Navbar";

// Mock react-router-dom hooks
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    // ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: "/orders" }),
}));
// Mock ROUTES 常數
jest.mock("@/constants/routes", () => [
    { path: "/", label: "儀表板" },
    { path: "/orders", label: "訂單列表" },
    { path: "/products", label: "商品列表" },
]);
// Mock ThemeToggle
jest.mock("@/components/ThemeToggle", () => () => (
    <div data-testid="mock-theme-toggle">ThemeToggle</div>));

describe("Navbar", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("應該將當前頁面按鈕 variant 設為 default", () => {
        render(<Navbar />);
        // 目前頁面是 /orders
        const currentButton = screen.getByRole("button", { name: "訂單列表" });
        expect(currentButton).toHaveClass("bg-primary"); // 或直接比對 variant 樣式 class
    });
    it("點擊其他按鈕應該呼叫 navigate", () => {
        render(<Navbar />);
        const dashboardBtn = screen.getByRole("button", { name: "儀表板" });
        fireEvent.click(dashboardBtn);

        expect(mockNavigate).toHaveBeenCalledWith("/");
    });
    it("應該渲染 ThemeToggle", () => {
        render(<Navbar />);
        expect(screen.getByTestId("mock-theme-toggle")).toBeInTheDocument();
    });
});
