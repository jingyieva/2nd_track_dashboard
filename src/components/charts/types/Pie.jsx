// src/components/charts/Pie.jsx

import React from "react"
import { Pie, PieChart } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const RADIAN = Math.PI / 180;

const renderSingleDataLabel = ({ cx, cy, outerRadius, innerRadius, midAngle, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
    const y = cy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

    return (
        <text data-testid={`data-label-${x}-${y}`} x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${((percent ?? 1) * 100).toFixed(0)}%`}
        </text>
    );
}

export default function CustomPieChart({
    name = 'custom',
    data = [],
    containerConfig = {},
    chartConfig = {}
}) {
    const {        
        showTooltip = true,
        showDataLabel = true,
        totalLabel,
        xAxisField,
        yAxisField
    } = chartConfig;
    
    const dataTotalAmount = React.useMemo(() => {
        return data.reduce((acc, curr) => acc + curr[yAxisField], 0)
    }, [data, yAxisField])

    return (
        <ChartContainer 
            config={containerConfig}
            data-testid={`${name}-pie-chart`}
        >
            {/* Recharts part */}
            <PieChart>
                { showTooltip ? (
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                    /> ) : null
                }
                <Pie
                    isAnimationActive={false}
                    cx="50%"
                    cy="50%"
                    data={data}
                    dataKey={yAxisField}
                    nameKey={xAxisField}
                    innerRadius="60%"
                    outerRadius="80%"
                    strokeWidth={5}
                    labelLine={false}
                    label={({ cx, cy, outerRadius, innerRadius, midAngle, percent }) => {
                        return (
                            <>
                                {/* data laabel */}
                                {
                                    showDataLabel ? renderSingleDataLabel({cx, cy, outerRadius, innerRadius, midAngle, percent}) : null
                                }
                                {/* center label */}
                                <text
                                    x={cx}
                                    y={cy}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    data-testid="center-label"
                                >
                                    <tspan
                                        x={cx}
                                        y={cy}
                                        className="fill-foreground text-3xl font-bold"
                                    >
                                        {dataTotalAmount.toLocaleString()}
                                    </tspan>
                                    <tspan
                                        x={cx}
                                        y={(cy || 0) + 24}
                                        className="fill-muted-foreground"
                                    >
                                        {totalLabel}
                                    </tspan>
                                </text>
                            </>
                        )
                    }
                    }
                >
                </Pie>
          </PieChart>
        </ChartContainer>
    )
}

