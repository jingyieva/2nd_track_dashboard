// src/components/charts/Pie.jsx

// import { Pie } from 'react-chartjs-2';

// export default {
//     component: (props) => <Pie {...props} />,
//     formatData: ({ datas, labels }, theme) => {
//         let datasets = [];
//         if (datas && datas.length > 0) {
//             datasets = datas.map(({ data, label }, index) => ({
//                 data,
//                 label,
//                 backgroundColor: datas.length > 1 ? theme.themeColor[index] : theme.themeColor,
//                 borderWidth: 0
//             }))
            
//         }
//         return {
//             datasets,
//             labels,

//         };
//     },
//     options: {
//         maintainAspectRatio: false,
//         plugins: {
//             datalabels: {
//                 formatter: (value) => value,
//             },
//             tooltip: {
//                 callbacks: {
//                     label: (context) => {
//                         const percent = ((context.raw
//                                 / context.dataset.data.reduce((partialSum, cur) => partialSum + cur, 0)) * 100);
//                         return `${context.label} : ${context.formattedValue} (${Math.round(percent)}%)`;
//                     },
//                 },
//             },
//         },
//     },
//     plugins: [
//         // ChartDataLabels,
//     ],
// };


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
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${((percent ?? 1) * 100).toFixed(0)}%`}
        </text>
    );
}

export default function CustomPieChart({
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
    }, [])

    return (
        <ChartContainer 
            config={containerConfig}
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

