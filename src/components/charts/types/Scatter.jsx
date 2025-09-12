// src/components/charts/types/Scatter.jsx
import {
    CartesianGrid,
    XAxis,
    YAxis,
    ScatterChart,
    Scatter,
    ZAxis,
} from "recharts";

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart"

import { cn } from '@/lib/utils'

/**
 * props:
 * - data: [{ ... }]
 * - options: {
 *     containerConfig: {
 *       [xField]: { label, formatter?, color? },
 *       [yField]: { label, formatter?, color? },
 *       [sizeField]?: { label, formatter? },
 *       [colorField]?: { label },
 *       // 也可註冊每個 category 要用的顏色： ex. containerConfig: { shopee: { color: '...' } }
 *     },
 *     chart: {
 *       xAxisField, yAxisField, sizeField?, colorField?, showLegend?, dotSize?: number
 *     }
 *   }
 */
export default function CustomScatterChart({
    name = 'scatter',
    data = [],
    containerConfig = {},
    chartConfig = {},
    className = '',
    legendContent = null,
    tooltipContent = null
}) {

    const {
        xAxisField: xKey = "x",
        yAxisField: yKey = "y",
        colorField: colorKey = null,
        sizeField = null,
        showLegend = true,
        margin = { top: 8, right: 16, bottom: 8, left: 0 },
        dotSize = 100,
        a11y = {}
    } = chartConfig;

    const sizeConf = sizeField ? containerConfig?.[sizeField] : null;

    // 1) 防呆：確保數值是 number
    const safe = Array.isArray(data)
        ? data
            .map((d) => ({
                ...d,
                [xKey]: Number(d?.[xKey]),
                [yKey]: Number(d?.[yKey]),
            }))
            .filter(
                (d) => Number.isFinite(d[xKey]) && Number.isFinite(d[yKey])
            )
        : [];

    // 2) 依 colorKey 分組（讓每組有獨立顏色）
    const groups = colorKey
        ? safe.reduce((acc, cur) => {
            const k = cur[colorKey] ?? "__NA__";
            (acc[k] ||= []).push(cur);
            return acc;
        }, {})
        : { __SINGLE__: safe };

    // 3) 建立 ChartContainer config（決定 legend 標籤與顏色）
    //    注意：config 的 key 需對應到 fill 用的 var(--color-KEY)
    //    你可以從 options.containerConfig 帶進 label 與 color；否則給預設
    const defaultPalette = [
        "hsl(var(--chart-1))",
        "hsl(var(--chart-2))",
        "hsl(var(--chart-3))",
        "hsl(var(--chart-4))",
        "hsl(var(--chart-5))",
        "hsl(var(--chart-6))",
    ];

    const groupKeys = Object.keys(groups);
    const config = groupKeys.length
        ? groupKeys.reduce((acc, gk, i) => {
            const c = containerConfig[gk] || {};
            acc[gk] = {
                label:
                    c.label ||
                    (gk === "shopee"
                        ? "蝦皮"
                        : gk === "carousell"
                            ? "旋轉"
                            : gk === "other"
                                ? "其他"
                                : gk),
                color: c.color || defaultPalette[i % defaultPalette.length],
            };
            return acc;
        }, {})
        : {
            series: {
                label: containerConfig.series?.label || "資料",
                color: containerConfig.series?.color || defaultPalette[0],
            },
        };

    // 4) X/Y 標籤（顯示用）
    const xLabel = containerConfig?.[xKey]?.label || xKey;
    const yLabel = containerConfig?.[yKey]?.label || yKey;

    const customTooltip = tooltipContent && typeof tooltipContent === "function" ? (props) => tooltipContent(props) : tooltipContent;

    // 5) 一定要把高度掛在 ChartContainer 這層（跟你其他圖一致）
    return (
        <ChartContainer
            config={config}
            className={cn("w-full h-64", className)} // 讓高度確保傳遞到內部
            data-testid={`${name}-scatter-chart`}
        >
            {safe.length === 0 ? (
                <div className="h-full grid place-items-center text-sm text-muted-foreground">
                    No data available.
                </div>
            ) : (
                <ScatterChart margin={margin}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey={xKey}
                        name={xLabel}
                        type="number"
                        domain={['auto', 'auto']}
                        tickLine={false}
                        tickFormatter={(v) => Number(v).toLocaleString()}
                    />
                    <YAxis
                        dataKey={yKey}
                        name={yLabel}
                        type="number"
                        domain={['auto', 'auto']}
                        tickLine={false}
                        tickFormatter={(v) => Number(v).toLocaleString()}
                    />
                    {/* Z 軸：若無 sizeField，給定固定大小 */}
                    <ZAxis
                        dataKey={sizeField || undefined}
                        range={sizeField ? [60, 400] : [dotSize, dotSize]}
                        name={sizeConf?.label || (sizeField || "size")}
                        tickFormatter={sizeConf?.formatter}
                    />
                    {/* Tooltip */}
                    <ChartTooltip
                        content={(customTooltip ?? (
                            <ChartTooltipContent
                                formatter={(val, name, entry) => {
                                    console.log(entry)
                                    const label =
                                        name === xKey
                                            ? xLabel
                                            : name === yKey
                                                ? yLabel
                                                : name === sizeField
                                                    ? sizeConf?.label || name
                                                    : name;
                                    return `${label}: ${Number(val).toLocaleString()}`;
                                }}
                                hideLabel
                            />
                        )
                        )}
                    />
                    {/* Legend */}
                    {showLegend && (
                        <ChartLegend
                            content={
                                legendContent ?? <ChartLegendContent config={config} />
                            }
                        />
                    )}
                    {/* Main Scatter Dot */}
                    {Object.entries(groups).map(([gk, arr], idx) => {

                        const renderDot = (props) => {
                            const { cx, cy, payload } = props;
                            const xVal = payload?.[xKey];
                            const yVal = payload?.[yKey];
                            const pVal = colorKey ? payload?.[colorKey] : undefined;
                            const label =
                                `${containerConfig?.[xKey]?.label || xKey} ${Number(xVal).toLocaleString()}, ${containerConfig?.[yKey]?.label || yKey} ${Number(yVal).toLocaleString()}`
                            return (
                                <circle cx={cx} cy={cy} r={Math.max(2, dotSize / 20)} fill={config[gk]?.color || "hsl(var(--chart-1))"}>
                                    {a11y?.enableDotTitle && <title>{label}</title>}
                                </circle>
                            );
                        };
                        return (
                            <Scatter
                                key={gk}
                                name={gk}
                                data={arr}
                                // 重點：顏色走 ChartContainer 的 CSS 變數
                                fill={config[gk]?.color || "hsl(var(--chart-1))"}
                                shape={renderDot}
                            />
                        )
                    })}
                </ScatterChart>
            )}
        </ChartContainer>
    );
}
