import React from "react";

/* 
    在 React/jsdom 裡，SVG 標籤必須出現在 <svg> 命名空間下；現在它被插在 <div>（HTML）樹下，
    React 會警告「The tag <text> is unrecognized…」。
*/

exports.ChartContainer = ({ children, config, ...rest }) =>
  React.createElement("div", { "data-testid": "chart-container", "data-config": JSON.stringify(config), ...rest }, children);

// 🔧 重點：過濾 content，不把它當成 DOM 屬性；但可以把內容渲染出來方便測試
exports.ChartLegend = ({ children, content /* <- 過濾 */, ...rest }) =>
  React.createElement("div", { "data-testid": "legend", ...rest }, children);

exports.ChartLegendContent = () => React.createElement("div", { "data-testid": "legend-content" })

// 🔧 重點：過濾 cursor；若要檢查，可映射成 data-cursor
exports.ChartTooltip = ({ children, cursor /* <- 過濾 */, ...rest }) =>
  React.createElement("div", { "data-testid": "tooltip", "data-cursor": String(Boolean(cursor)), ...rest }, children);

exports.ChartTooltipContent = ({ hideLabel }) =>
  React.createElement("div", { "data-testid": "tooltip-content" }, hideLabel ? "hide" : "show");