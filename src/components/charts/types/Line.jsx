// src/components/charts/Line.jsx

// import { Line } from 'react-chartjs-2';

// export default {
//     component: (props) => <Line {...props} />,
//     formatData: ({ datas, labels, isArea }, theme) => {
//         let datasets = [];

//         if (datas && datas.length > 0) {
//             if (datas && datas.length > 0) {
//                 datasets = datas.map(({ data, label }, index) => ({
//                     data,
//                     label,
//                     borderColor: theme.themeColor[index],
//                     borderWidth: 1,
//                     fill: false,
//                 }))   
//             }
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
//                 formatter: (value, context) => value,
//             },
//         },
//         scales: {
//             x: {
//                 ticks: {
//                     autoSkip: false,
//                 },
//             },
//             y: {
//                 ticks: {
//                     autoSkip: false,
//                     precision: 0,
//                     beginAtZero: true,
//                 },
//             },
//         },
//     },
//     // plugins: [ChartDataLabels],
// };


import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"


export default function CustomLineChart({
    data = [],
    containerConfig = {},
    chartConfig = {}
}) {
    const {        
    showY = false,
    showX = true,
    showLengend = false,
    showTooltip = true,
    xAxisField = '',
    yAxisField = '',
    showYLabel = true,
    showDataDot = true } = chartConfig;
    
    return (
        <ChartContainer config={containerConfig} className="aspect-auto h-[250px] w-full">
            <LineChart
                accessibilityLayer
                data={data}
                margin={{
                    top: 20,
                    left: 12,
                    right: 12,
                }}
            >
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey={xAxisField}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    // tickFormatter={(value) => value.slice(0, 3)}
                />
                { showTooltip ? (
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent />}
                    /> ) : null
                }
                <Line
                    dataKey={yAxisField}
                    type="natural"
                    stroke={`var(--color-${xAxisField})`}
                    strokeWidth={2}
                    dot={showDataDot ? {
                        fill:`var(--color-${xAxisField})`,
                    } : false}
                    activeDot={showDataDot ? {
                        r: 6,
                    } : false}
                >
                    {
                        showYLabel ? (
                            <LabelList
                                position="top"
                                offset={12}
                                className="fill-foreground"
                                fontSize={12}
                            />
                        ) : null
                    }
                </Line>
            </LineChart>
        </ChartContainer>
    )
}
