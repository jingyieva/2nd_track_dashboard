import { render, screen } from "@testing-library/react";

jest.mock("@/components/ui/chart");
jest.mock("recharts", () => require('@/components/ui/recharts'));

import CustomLineChart from "@/components/charts/types/Line";

const data = [
    { day: "Mon", value: 10 },
    { day: "Tue", value: 15 },
];

describe("CustomLineChart", () => {
    it("renders tooltip when enabled", () => {
        render(
            <CustomLineChart name="test" data={data} chartConfig={{ xAxisField: "day", yAxisField: "value", showTooltip: true }} />
        );
        expect(screen.getByTestId("tooltip")).toBeInTheDocument();
    });

    it("uses the correct stroke CSS variable based on xAxisField", () => {
        render(
            <CustomLineChart name="test" data={data} chartConfig={{ xAxisField: "day", yAxisField: "value" }} />
        );
        const line = screen.getByTestId("line");
        expect(line).toHaveAttribute("data-stroke", "var(--color-day)");
    });

    it("toggles dots via showDataDot", () => {
        const { rerender } = render(
            <CustomLineChart name="test" data={data} chartConfig={{ xAxisField: "day", yAxisField: "value", showDataDot: true }} />
        );
        expect(screen.getByTestId("line")).toHaveAttribute("data-dot", "true");

        rerender(
            <CustomLineChart name="test" data={data} chartConfig={{ xAxisField: "day", yAxisField: "value", showDataDot: false }} />
        );
        expect(screen.getByTestId("line")).toHaveAttribute("data-dot", "false");
    });
});
