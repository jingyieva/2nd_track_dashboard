/* chart 測試重點：
    封裝的 CustomBarChart / ChartRenderer 有沒有正確把 props 傳給 Recharts。
    至於 Recharts 內部怎麼把 xAxisField 畫在正確位置，那是它自己的責任，不需要重複測。 

    不穩定 (flaky)
    * Recharts 會產生不同的 path / d 屬性值，跟版本、瀏覽器環境有關。
    * snapshot 測試經常因 SVG 內部屬性改動而 fail。
*/

import { render, screen } from "@testing-library/react";
import { ThemeProvider } from '@/contexts/theme-context';

jest.mock("@/components/ui/chart");
jest.mock("recharts", () => require('@/components/ui/recharts'));

import { ChartRenderer } from "@/components/charts/ChartRenderer";

const sample = [{ name: "A", value: 10 }];

describe("ChartRenderer", () => {
    it("renders fallback when empty data", () => {
        render(
            <ThemeProvider>
                <ChartRenderer data={[]} fallback="No data" />
            </ThemeProvider>
        );
        expect(screen.getByText(/No data/i)).toBeInTheDocument();
    });

    it("renders Bar by default", () => {
        render(
            <ThemeProvider>
                <ChartRenderer data={sample} options={{ chart: { xAxisField: "name", yAxisField: "value" } }} />
            </ThemeProvider>
        );
        expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
    });

    it("renders Line when variant=Line", () => {
        render(
            <ThemeProvider>
                <ChartRenderer variant="Line" data={sample} options={{ chart: { xAxisField: "name", yAxisField: "value" } }} />
            </ThemeProvider>
        );
        expect(screen.getByTestId("line-chart")).toBeInTheDocument();
    });

    it("renders Pie when variant=Pie", () => {
        render(
            <ThemeProvider>
                <ChartRenderer variant="Pie" data={sample} options={{ chart: { xAxisField: "name", yAxisField: "value" } }} />
            </ThemeProvider>
        );
        expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
    });
});
