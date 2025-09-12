// src/components/charts/types/Pie.jsx

import React from "react"
import { Pie, PieChart } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import { cn } from '@/lib/utils'

import { useTheme } from '@/contexts/theme-context';

const RADIAN = Math.PI / 180;

const renderSingleDataLabel = ({ cx, cy, outerRadius, innerRadius, midAngle, percent, curTheme }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
    const y = cy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

    return (
        <text 
            data-testid={`data-label-${x}-${y}`} 
            x={x} 
            y={y} 
            fill={curTheme === "light" ? "#000000": "#ffffff"} 
            textAnchor={x > cx ? 'start' : 'end'} 
            dominantBaseline="central"
            fontWeight={'bold'}
        >
            {`${((percent ?? 1) * 100).toFixed(0)}%`}
        </text>
    );
}

export default function CustomPieChart({
    name = 'custom',
    data = [],
    containerConfig = {},
    chartConfig = {},
    className = ""
}) {
    const { resolvedTheme: curTheme } = useTheme();
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
            className={cn("w-full h-64", className)}
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
                    innerRadius="65%"
                    outerRadius="95%"
                    strokeWidth={5}
                    labelLine={false}
                    label={({ cx, cy, outerRadius, innerRadius, midAngle, percent }) => {
                        return (
                            <>
                                {/* data laabel */}
                                {
                                    showDataLabel ? renderSingleDataLabel({cx, cy, outerRadius, innerRadius, midAngle, percent, curTheme}) : null
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

