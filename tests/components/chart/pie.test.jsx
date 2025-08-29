import { render, screen } from "@testing-library/react";

jest.mock("@/components/ui/chart");
jest.mock("recharts", () => require('@/components/ui/recharts'));

import CustomPieChart from "@/components/charts/types/Pie";

const data = [
{ name: "A", count: 30 },
{ name: "B", count: 20 },
];

describe("CustomPieChart", () => {
    it("renders center total and totalLabel", () => {
        render(
            <CustomPieChart name="test" data={data} chartConfig={{ xAxisField: "name", yAxisField: "count", totalLabel: "Total Orders" }} />
        );
        expect(screen.getByTestId("center-label")).toBeInTheDocument();
        expect(screen.getByText("50")).toBeInTheDocument();
        expect(screen.getByText(/Total Orders/i)).toBeInTheDocument();
    });

    it("hides data labels when showDataLabel=false", () => {
        render(<CustomPieChart name="test" data={data} chartConfig={{ xAxisField: "name", yAxisField: "count", showDataLabel: false }} />);
        expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
    });
});
