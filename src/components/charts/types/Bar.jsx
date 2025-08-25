// src/components/charts/Bar.jsx
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, LabelList } from "recharts"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"


export default function CustomBarChart({
    data = [],
    containerConfig = {},
    chartConfig = {}
}) {
    const {        
        showY = false,
        showX = true,
        showLengend = false,
        showTooltip = true,
        isStackedBar = false,
        isHorizonal = false,
        xAxisField = '',
        yAxisField = '' } = chartConfig;

    return (
        <ChartContainer config={containerConfig}>
            {/* Recharts part */}
            <BarChart 
                accessibilityLayer 
                data={data}
                layout={isHorizonal ? "vertical" : 'horizontal'}
            >
                {/* Chart Grid Line */}
                <CartesianGrid vertical={false} horizontal={false} />
                {/* YAxis */}
                { showY || isHorizonal ? (<YAxis 
                            dataKey={isHorizonal ? xAxisField : yAxisField }
                            type={isHorizonal ? "category" : "number"}
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
                            dataKey={isHorizonal ? yAxisField : xAxisField}
                            type={isHorizonal ? "number" : "category"}
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            hide={isHorizonal}
                        />
                    ) : null
                }
                {/* Legend */}
                { showLengend ? <ChartLegend content={<ChartLegendContent />} /> : null }
                {/* Tooltip */}
                { showTooltip ? (
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                    /> ) : null
                }
                <Bar 
                    dataKey={yAxisField} 
                    fill={`var(--color-${xAxisField}`} 
                    radius={8}
                    isAnimationActive={false}
                >

                    {
                        isHorizonal ? (
                            <>
                                {/* <LabelList
                                    dataKey={xAxisField}
                                    position="insideLeft"
                                    offset={8}
                                    className="fill-(--color-label)"
                                    fontSize={12}
                                /> */}
                                <LabelList
                                    dataKey={yAxisField}
                                    position="insideRight"
                                    offset={8}
                                    className="fill-foreground"
                                    fontSize={12}
                                />
                            </>
                        ) : null
                    }
                </Bar>
            </BarChart>
        </ChartContainer>
    )
}

