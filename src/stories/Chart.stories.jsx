import React from 'react';
import { within, userEvent } from 'storybook/test';
import { ChartRenderer } from '@/components/charts/ChartRenderer';

// ---- Demo Data ----
const monthData = [
  { month: 'Jan', sales: 420, orders: 18 },
  { month: 'Feb', sales: 310, orders: 12 },
  { month: 'Mar', sales: 560, orders: 22 },
  { month: 'Apr', sales: 260, orders: 9  },
  { month: 'May', sales: 610, orders: 24 },
];

const platformData = [
  { platform: 'Shopee', amount: 450, fill: "var(--color-Shopee)" },
  { platform: 'Carousell', amount: 300, fill: "var(--color-Carousell)" },
  { platform: 'Instagram', amount: 250, fill: "var(--color-Instagram)" },
];

// 多序列（Bar stacked / grouped）
const multiSeries = [
  { month: 'Jan', A: 200, B: 120, C: 100 },
  { month: 'Feb', A: 160, B: 80,  C: 70  },
  { month: 'Mar', A: 240, B: 160, C: 120 },
  { month: 'Apr', A: 120, B: 90,  C: 50  },
  { month: 'May', A: 260, B: 180, C: 170 },
];

// 預設容器設定：可在你的 ChartContainer 內讀取 config 設置 CSS 變數等
const defaultContainer = {
  month: {
      label: "month",
      color: "var(--chart-1)",
  },
  A: {
      label: "A",
      color: "var(--chart-1)",
  },
  B: {
      label: "B",
      color: "var(--chart-2)",
  },
  C: {
      label: "C",
      color: "var(--chart-3)",
  },
  sales: {
      label: "sales",
      color: "var(--chart-2)",
  },
  orders: {
      label: "orders",
      color: "var(--chart-3)",
  },
  platform: {
      label: "platform",
      color: "var(--chart-1)",
  },
  amount: {
      label: "amount",
      color: "var(--chart-2)",
  },
  Shopee: {
      label: "Shopee",
      color: "var(--chart-1)",
  },
  Carousell: {
      label: "Carousell",
      color: "var(--chart-2)",
  },
  Instagram: {
      label: "Shopee",
      color: "var(--chart-3)",
  }

};

export default {
  title: 'Components/Chart',
  component: ChartRenderer,
  args: {
    name: 'demo',
    variant: 'Bar',      // 'Bar' | 'Line' | 'Pie'
    data: monthData,
    options: {
      container: defaultContainer,
      chart: {
        // Bar: xAxisField / yAxisField
        xAxisField: 'month',
        yAxisField: 'sales',
        showX: true,
        showY: false,
        showLegend: false,
        showTooltip: true,
        isStackedBar: false,
        isHorizontal: false,
        // Line: showDataDot/showYLabel 也在這裡切
        showDataDot: true,
        showYLabel: true,
        // Pie: totalLabel 會用於中心標籤
        totalLabel: 'Total',
      },
    },
    isLoading: false,
    fallback: 'No data available',
    className: 'max-w-[760px]',
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['Bar', 'Line', 'Pie'],
    },
    isLoading: { control: 'boolean' },
    data: { control: 'object' },
    options: { control: 'object' },
  },
};

// ========== Stories ==========

// 1) 單序列柱狀圖
export const BarSingleSeries = {
  name: 'Bar / Single',
  args: {
    variant: 'Bar',
    data: monthData,
    options: {
      container: defaultContainer,
      chart: {
        xAxisField: 'month',
        yAxisField: 'sales',
        showX: true,
        showY: false,
        showLegend: false,
        showTooltip: true,
        isStackedBar: false,
        isHorizontal: false,
      },
    },
  },
};

// 2) 多序列（疊圖）
export const BarStackedMulti = {
  name: 'Bar / Mulit Stacked',
  args: {
    variant: 'Bar',
    data: multiSeries,
    options: {
      container: defaultContainer,
      chart: {
        xAxisField: 'month',
        yAxisField: ['A', 'B', 'C'], // 你的 Bar.jsx 會自動渲染多個 <Bar>
        isStackedBar: true,
        showY: true,
        showLegend: true,
      },
    },
  },
};

// 3) 水平柱狀圖
export const BarHorizontal = {
  name: 'Bar / Horizontal',
  args: {
    variant: 'Bar',
    data: platformData,
    options: {
      container: defaultContainer,
      chart: {
        xAxisField: 'platform', // 水平時：放在 Y 軸
        yAxisField: 'amount',   // 這會當成數值軸
        isHorizontal: true,
      },
    },
    className: 'max-w-[560px]',
  },
};

// 4) 折線圖
export const LineBasic = {
  name: 'Line',
  args: {
    variant: 'Line',
    data: monthData,
    options: {
      container: defaultContainer,
      chart: {
        xAxisField: 'month',
        yAxisField: 'orders',
        showTooltip: true,
        showDataDot: true,
        showYLabel: true,
      },
    },
  },
};

// 5) 圓餅圖（中央彙總）
export const PieBasic = {
  name: 'Pie',
  args: {
    variant: 'Pie',
    data: platformData,
    options: {
      container: defaultContainer,
      chart: {
        xAxisField: 'platform',
        yAxisField: 'amount',
        showTooltip: true,
        showDataLabel: true,
        totalLabel: 'Orders',
      },
    },
    className: 'max-w-[520px]',
  },
};

// 6) 空資料
export const EmptyState = {
  args: {
    data: [],
    variant: 'Bar',
  },
};

// 7) 載入中
export const LoadingState = {
  args: {
    isLoading: true,
    variant: 'Bar',
  },
};

// 8) 互動：切換資料集（示範 play）
export const ToggleDataset = {
  render: function ToggleStory(args) {
    const [data, setData] = React.useState(args.data);
    const bump = () =>
      setData((d) =>
        d === args.data
          ? args.data.map((x) =>
              typeof x.sales === 'number'
                ? { ...x, sales: Math.round(x.sales * 1.2) }
                : x
            )
          : args.data
      );

    return (
      <div className="space-y-3">
        <button
          data-testid="toggle"
          className="rounded-md border px-3 py-1 text-sm"
          onClick={bump}
        >
          Toggle data
        </button>
        <ChartRenderer
          {...args}
          data={data}
          variant="Bar"
          options={{
            container: defaultContainer,
            chart: {
              xAxisField: 'month',
              yAxisField: 'sales',
              showTooltip: true,
            },
          }}
        />
      </div>
    );
  },
  args: {
    data: monthData,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByTestId('toggle'));
  },
};

export const ToggleStacked = {
    args: { 
        variant: 'Bar', 
        data: multiSeries, 
        options:{ 
            container: defaultContainer,
            chart:{ 
                xAxisField: 'month', 
                yAxisField: ['A','B','C'], 
                showLegend: true 
            }
        }
    },
    render: (args) => {
        const [stacked, setStacked] = React.useState(false);

        return (
        <div className="space-y-4">
            <button
                data-testid="isStackedBar"
                onClick={() => setStacked((s) => !s)}
                className="rounded bg-blue-500 px-3 py-1 text-white"
            >
            {stacked ? 'stacked' : 'unstacked'}
            </button>

            <ChartRenderer
                {...args}
                options={{
                    ...args.options,
                    chart: {
                    ...args.options.chart,
                    isStackedBar: stacked,
                    showLegend: true,
                    },
                }}
            />
        </div>
        );
    },
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement);
        await userEvent.click(canvas.getByTestId("isStackedBar"));
    }
}