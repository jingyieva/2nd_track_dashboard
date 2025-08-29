import { render, screen } from "@testing-library/react";

jest.mock("@/components/ui/chart");
jest.mock("recharts", () => require('@/components/ui/recharts'));

import CustomBarChart from "@/components/charts/types/Bar";

const DATA = [
    { label: "Mon", amount: 20 },
    { label: "Tue", amount: 35 },
];

describe("CustomBarChart", () => {
    it("shows X axis by default and hides Y axis when showY=false", () => {
        render(
            <CustomBarChart name="test" data={DATA} chartConfig={{ xAxisField: "label", yAxisField: "amount", showY: false }} />
        );
        expect(screen.getByTestId("x-axis")).toBeInTheDocument();
        expect(screen.queryByTestId("y-axis")).toBeNull();
    });

    it("shows Y axis by default and hides X axis when showX=false", () => {
        render(
            <CustomBarChart name="test" data={DATA} chartConfig={{ xAxisField: "label", yAxisField: "amount", showX: false, showY: true }} />
        );
        expect(screen.getByTestId("y-axis")).toBeInTheDocument();
        expect(screen.queryByTestId("x-axis")).toBeNull();
    });
    it("switches to vertical layout when isHorizontal=true and shows Y axis", () => {
        render(
            <CustomBarChart name="test" data={DATA} chartConfig={{ xAxisField: "label", yAxisField: "amount", isHorizontal: true }} />
        );
        expect(screen.getByTestId("bar-chart")).toHaveAttribute("data-layout", "vertical");
        expect(screen.getByTestId("y-axis")).toBeInTheDocument();
    });

    it("renders legend and tooltip conditionally", () => {
        render(
            <CustomBarChart name="test" data={DATA} chartConfig={{ xAxisField: "label", yAxisField: "amount", showLegend: true, showTooltip: true }} />
        );
        expect(screen.getByTestId("legend")).toBeInTheDocument();
        expect(screen.getByTestId("tooltip")).toBeInTheDocument();
    });

    it("passes correct dataKey and fill to Bar", () => {
        render(
            <CustomBarChart name="test" data={DATA} chartConfig={{ xAxisField: "label", yAxisField: "amount" }} />
        );
        const bar = screen.getByTestId("bar");
        expect(bar).toHaveAttribute("data-datakey", "amount");
        expect(bar).toHaveAttribute("data-fill", "var(--color-label)");
    });

    // stacked bar test cases
    it("renders multiple <Bar> and stack them when yAxisField is array + isStackedBar=true", () => {
        render(
        <CustomBarChart
            data={DATA}
            chartConfig={{
                xAxisField: "label",
                yAxisField: ["in", "out"],
                isStackedBar: true,
            }}
        />
        )

        const bars = screen.getAllByTestId("bar")
        expect(bars).toHaveLength(2)

        // 第一個序列
        expect(bars[0]).toHaveAttribute("data-datakey", "in")
        expect(bars[0]).toHaveAttribute("data-stackid", "stack")
        expect(bars[0]).toHaveAttribute("data-fill", "var(--color-in)")

        // 第二個序列
        expect(bars[1]).toHaveAttribute("data-datakey", "out")
        expect(bars[1]).toHaveAttribute("data-stackid", "stack")
        expect(bars[1]).toHaveAttribute("data-fill", "var(--color-out)")
    })

    it("single-series + isStackedBar=true still renders one Bar with stackId", () => {
        render(
            <CustomBarChart
                data={DATA.map(({ label, in: amount }) => ({ label, amount }))} // 單序列
                chartConfig={{
                    xAxisField: "label",
                    yAxisField: "amount",
                    isStackedBar: true,
                }}
            />
        )

        const bars = screen.getAllByTestId("bar")
        expect(bars).toHaveLength(1)

        const bar = bars[0]
        expect(bar).toHaveAttribute("data-datakey", "amount")
        expect(bar).toHaveAttribute("data-stackid", "stack")
        // 單序列沿用你原邏輯：用 x 軸欄位作色票 key
        expect(bar).toHaveAttribute("data-fill", "var(--color-label)")
    })

    it("renders vertical layout, shows Y axis, hides X axis, and stacks series", () => {

        render(
        <CustomBarChart
            data={DATA}
            chartConfig={{
                xAxisField: "label",
                yAxisField: ["in", "out"],
                isStackedBar: true,
                isHorizontal: true,
                showX: true,   // 水平下仍會 hide
                showY: false,  // 水平下仍會顯示分類 Y 軸
            }}
        />
        )

        expect(screen.getByTestId("bar-chart")).toHaveAttribute("data-layout", "vertical")
        expect(screen.getByTestId("y-axis")).toBeInTheDocument()

        const xAxis = screen.queryByTestId("x-axis")
        if (xAxis) {
        const props = JSON.parse(xAxis.getAttribute("data-props") || "{}")
        expect(props.hide).toBe(true)
        }

        const bars = screen.getAllByTestId("bar")
        expect(bars).toHaveLength(2)

        expect(bars[0]).toHaveAttribute("data-datakey", "in")
        expect(bars[0]).toHaveAttribute("data-stackid", "stack")
        expect(bars[0]).toHaveAttribute("data-fill", "var(--color-in)")

        expect(bars[1]).toHaveAttribute("data-datakey", "out")
        expect(bars[1]).toHaveAttribute("data-stackid", "stack")
        expect(bars[1]).toHaveAttribute("data-fill", "var(--color-out)")

        expect(screen.queryByTestId("label-list")).toBeNull()
    })
});
