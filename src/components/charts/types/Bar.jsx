// src/components/charts/types/Bar.jsx
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, LabelList } from "recharts"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { cn } from '@/lib/utils'


export default function CustomBarChart({
    name = 'custom',
    data = [],
    containerConfig = {},
    chartConfig = {},
    className
}) {
    const {        
        showY = false,
        showX = true,
        showLegend = false,
        showTooltip = true,
        isStackedBar = false,
        isHorizontal = false,
        xAxisField = '',
        yAxisField = '' } = chartConfig;
    
        // 允許 yAxisField: string | string[]  
    const seriesKeys = Array.isArray(yAxisField) ? yAxisField : [yAxisField]
    const isMultiSeries = seriesKeys.length > 1


    return (
        <ChartContainer 
            config={containerConfig}
            data-testid={`${name}-bar-chart`}
            className={cn("w-full h-64", className)}
        >
            {/* Recharts part */}
            <BarChart 
                accessibilityLayer 
                data={data}
                layout={isHorizontal ? "vertical" : 'horizontal'}
            >
                {/* Chart Grid Line */}
                <CartesianGrid vertical={false} horizontal={false} />
                {/* YAxis */}
                { showY || isHorizontal ? (<YAxis 
                            dataKey={isHorizontal ? xAxisField : undefined }
                            type={isHorizontal ? "category" : "number"}
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            width={100}
                            // hide
                             /> ): null }
                {/* XAxis */}
                {
                    showX ? (
                        <XAxis
                            dataKey={isHorizontal ? undefined : xAxisField}
                            type={isHorizontal ? "number" : "category"}
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            hide={isHorizontal}
                        />
                    ) : null
                }
                {/* Legend */}
                { showLegend ? <ChartLegend content={<ChartLegendContent />} /> : null }
                {/* Tooltip */}
                { showTooltip ? (
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                    /> ) : null
                }
                {/* ⬇️ 多個序列時，渲染多個 <Bar>；單序列維持原本行為 */}
                {seriesKeys.map((key) => {
                    const fillColor = isMultiSeries ? `var(--color-${key})` : `var(--color-${xAxisField})`
                    return (
                        <Bar
                            key={`${data[`${xAxisField}`]}-${key}`}
                            dataKey={key}
                            fill={fillColor}
                            radius={4}
                            isAnimationActive={false}
                            stackId={isStackedBar ? "stack" : undefined}
                            data-testid="bar"
                        >
                        {/* 單序列 + 水平時才加內嵌 Label，避免堆疊時文字混亂 */}
                        {!isMultiSeries && isHorizontal ? (
                            <LabelList
                                dataKey={yAxisField}
                                position="insideRight"
                                offset={8}
                                className="fill-foreground"
                                fontSize={12}
                            />
                        ) : null}
                        </Bar>
                    )
                })}
            </BarChart>
        </ChartContainer>
    )
}

