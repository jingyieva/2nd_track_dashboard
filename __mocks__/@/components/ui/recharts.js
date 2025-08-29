import React from "react";

export const BarChart = ({ children, layout, data }) => (
    <div data-testid="bar-chart" data-layout={layout} data-length={data?.length || 0}>{children}</div>
);
export const LineChart = ({ children, data }) => (
    <div data-testid="line-chart" data-length={data?.length || 0}>{children}</div>
);
export const PieChart = ({ children }) => (
    <div data-testid="pie-chart">{children}</div>
);
export const Bar = ({ children, dataKey, fill, stackId }) => (
    <div data-testid="bar" data-datakey={dataKey} data-fill={fill}
      data-stackid={stackId || ""}
    >{children}</div>
);
export const Line = ({ children, dataKey, stroke, dot, activeDot }) => (
    <div data-testid="line" data-datakey={dataKey} data-stroke={stroke} data-dot={!!dot} data-active-dot={!!activeDot}>{children}</div>
);

export const XAxis = (props) => <div data-testid="x-axis" data-props={JSON.stringify(props)} />;
export const YAxis = (props) => <div data-testid="y-axis" data-props={JSON.stringify(props)} />;
export const CartesianGrid = () => <div data-testid="grid" />;
export const LabelList = (props) => <div data-testid="label-list" data-props={JSON.stringify(props)} />;

exports.PieChart = ({ children }) =>
  React.createElement("div", { "data-testid": "pie-chart" }, children);

exports.Pie = ({ children, dataKey, nameKey, label }) => {
  const labelNode =
    typeof label === "function"
      ? label({
          cx: 100,
          cy: 100,
          outerRadius: 80,
          innerRadius: 60,
          midAngle: 0,
          percent: 0.5,
        })
      : null;

  return React.createElement(
    "div",
    { "data-testid": "pie", "data-datakey": dataKey, "data-namekey": nameKey },
    // 將 label 放在 <svg> 命名空間下，避免 <text>/<tspan> 警告
    React.createElement("svg", { "data-testid": "pie-label-svg" }, labelNode),
    // 其他 children（我們的 mock 多為 <div>）仍放在 HTML 容器下
    React.createElement("div", { "data-testid": "pie-children" }, children)
  );
};