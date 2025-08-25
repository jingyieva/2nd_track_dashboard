// src/pages/Dashboard/index.jsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartRenderer } from '@/components/charts/ChartRenderer';


const PRODUCT_TYPE_DATAS = [
    { type: "電器", visitors: 275, fill: "var(--color-電器)" },
    { type: "裝飾品", visitors: 200, fill: "var(--color-裝飾品)" },
    { type: "扭蛋", visitors: 287, fill: "var(--color-扭蛋)" },
    { type: "服飾", visitors: 173, fill: "var(--color-服飾)" },
    { type: "家用小物", visitors: 190, fill: "var(--color-家用小物)" },
    { type: "其他", visitors: 190, fill: "var(--color-其他)" },
]

export default function ChartsFold() {

    return (
        <>

            <Card className="w-full min-w-0 md:col-span-2 lg:col-span-3">
                <CardHeader>
                    <CardTitle>近3個月交易趨勢</CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartRenderer  
                        variant='Line'
                        data={[
                            { date: "2025-04-01", count: 222,},
                            { date: "2025-04-02", count: 97, },
                            { date: "2025-04-03", count: 167,},
                            { date: "2025-04-04", count: 242,},
                            { date: "2025-04-05", count: 373,},
                            { date: "2025-04-06", count: 301,},
                            { date: "2025-04-07", count: 245,},
                            { date: "2025-04-08", count: 409,},
                            { date: "2025-04-09", count: 59, },
                            { date: "2025-04-10", count: 261,},
                            { date: "2025-04-11", count: 327,},
                            { date: "2025-04-12", count: 292,},
                            { date: "2025-04-13", count: 342,},
                            { date: "2025-04-14", count: 137,},
                            { date: "2025-04-15", count: 120,},
                            { date: "2025-04-16", count: 138,},
                            { date: "2025-04-17", count: 446,},
                            { date: "2025-04-18", count: 364,},
                            { date: "2025-04-19", count: 243,},
                            { date: "2025-04-20", count: 89, },
                            { date: "2025-04-21", count: 137,},
                            { date: "2025-04-22", count: 224,},
                            { date: "2025-04-23", count: 138,},
                            { date: "2025-04-24", count: 387,},
                            { date: "2025-04-25", count: 215,},
                            { date: "2025-04-26", count: 75, },
                            { date: "2025-04-27", count: 383,},
                            { date: "2025-04-28", count: 122,},
                            { date: "2025-04-29", count: 315,},
                            { date: "2025-04-30", count: 454,},
                            { date: "2025-05-01", count: 165,},
                            { date: "2025-05-02", count: 293,},
                            { date: "2025-05-03", count: 247,},
                            { date: "2025-05-04", count: 385,},
                            { date: "2025-05-05", count: 481,},
                            { date: "2025-05-06", count: 498,},
                            { date: "2025-05-07", count: 388,},
                            { date: "2025-05-08", count: 149,},
                            { date: "2025-05-09", count: 227,},
                            { date: "2025-05-10", count: 293,},
                            { date: "2025-05-11", count: 335,},
                            { date: "2025-05-12", count: 197,},
                            { date: "2025-05-13", count: 197,},
                            { date: "2025-05-14", count: 448,},
                            { date: "2025-05-15", count: 473,},
                            { date: "2025-05-16", count: 338,},
                            { date: "2025-05-17", count: 499,},
                            { date: "2025-05-18", count: 315,},
                            { date: "2025-05-19", count: 235,},
                            { date: "2025-05-20", count: 177,},
                            { date: "2025-05-21", count: 82, },
                            { date: "2025-05-22", count: 81, },
                            { date: "2025-05-23", count: 252,},
                            { date: "2025-05-24", count: 294,},
                            { date: "2025-05-25", count: 201,},
                            { date: "2025-05-26", count: 213,},
                            { date: "2025-05-27", count: 420,},
                            { date: "2025-05-28", count: 233,},
                            { date: "2025-05-29", count: 78, },
                            { date: "2025-05-30", count: 340,},
                            { date: "2025-05-31", count: 178,},
                            { date: "2025-06-01", count: 178,},
                            { date: "2025-06-02", count: 470,},
                            { date: "2025-06-03", count: 103,},
                            { date: "2025-06-04", count: 439,},
                            { date: "2025-06-05", count: 88, },
                            { date: "2025-06-06", count: 294,},
                            { date: "2025-06-07", count: 323,},
                            { date: "2025-06-08", count: 385,},
                            { date: "2025-06-09", count: 438,},
                            { date: "2025-06-10", count: 155,},
                            { date: "2025-06-11", count: 92, },
                            { date: "2025-06-12", count: 492,},
                            { date: "2025-06-13", count: 81, },
                            { date: "2025-06-14", count: 426,},
                            { date: "2025-06-15", count: 307,},
                            { date: "2025-06-16", count: 371,},
                            { date: "2025-06-17", count: 475,},
                            { date: "2025-06-18", count: 107,},
                            { date: "2025-06-19", count: 341,},
                            { date: "2025-06-20", count: 408,},
                            { date: "2025-06-21", count: 169,},
                            { date: "2025-06-22", count: 317,},
                            { date: "2025-06-23", count: 480,},
                            { date: "2025-06-24", count: 132,},
                            { date: "2025-06-25", count: 141,},
                            { date: "2025-06-26", count: 434,},
                            { date: "2025-06-27", count: 448,},
                            { date: "2025-06-28", count: 149,},
                            { date: "2025-06-29", count: 103,},
                            { date: "2025-06-30", count: 446,},
                        ]}
                        options={{
                            container: {
                                date: {
                                    label: "Date",
                                    color: "var(--chart-1)",
                                },
                            },
                            chart: {
                                xAxisField: 'date',
                                yAxisField: 'count',
                                showYLabel: false,
                                showDataDot: false,
                            }
                        }}
                        className={"h-64"}
                    />
                </CardContent>
            </Card>
            <Card className="w-full min-w-0 md:col-span-2 lg:col-span-1">
                <CardHeader>
                    <CardTitle>每月交易趨勢</CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartRenderer  
                        variant='Line'
                        data={[
                            { month: "2025-02", count: 2},
                            { month: "2025-03", count: 5},
                            { month: "2025-04", count: 9},
                            { month: "2025-05", count: 7},
                            { month: "2025-06", count: 10},
                            { month: "2025-07", count: 5}
                        ]}
                        options={{
                            container: {
                                month: {
                                    label: "Month",
                                    color: "var(--chart-1)",
                                },
                            },
                            chart: {
                                xAxisField: 'month',
                                yAxisField: 'count',
                            }
                        }}    
                        className={"h-64"}
                    />
                </CardContent>
            </Card>
            
            <Card className="w-full min-w-0 md:col-span-2 lg:col-span-1">
                <CardHeader>
                    <CardTitle>熱門商品排名</CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartRenderer  
                        variant='Bar'
                        data={[
                            { productType: "Google Chrome TV", totalPrice: 2350 },
                            { productType: "戽斗星球", totalPrice: 1200 },
                            { productType: "來貘杯緣子", totalPrice: 500 },
                            { productType: "皮卡丘存錢筒", totalPrice: 350 },
                            { productType: "運動短褲", totalPrice: 200 },
                            { productType: "護髮油", totalPrice: 180 },
                        ]}
                        options={{
                            container: {
                                productType: {
                                    label: "productType",
                                    color: "var(--chart-1)",
                                },
                                totalPrice: {
                                    label: "totalPrice",
                                    color: "var(--chart-1)",
                                },
                            },
                            chart: {
                                xAxisField: 'productType',
                                yAxisField: 'totalPrice',
                                isHorizonal: true,
                            }
                        }}
                    />
                </CardContent>
            </Card>
             <Card className="w-full min-w-0 md:col-span-2 lg:col-span-1">
                <CardHeader>
                    <CardTitle>商品類別占比</CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartRenderer  
                        variant='Pie'
                        data={PRODUCT_TYPE_DATAS.reduce((prev, cur, curIndex) => {
                            return [
                                ...prev,
                                {
                                    ...cur,
                                    fill: `var(--color-${cur.type})`,
                                }
                            ]
                        }, [])}
                        options={{
                            container: {
                                visitors: {
                                    label: "Visitors",
                                },
                                ...(PRODUCT_TYPE_DATAS.reduce((prev, cur, curIndex) => {
                                    return ({
                                        ...prev, 
                                        [`${cur.type}`]: {
                                            label: `${cur.type}`,
                                            color: `var(--chart-${curIndex+1})`,
                                        }
                                    });
                                }, {}))
                            },
                            chart: {
                                totalLabel: 'Visitors',
                                xAxisField: 'type',
                                yAxisField: 'visitors',
                                
                            }
                        }}
                        // className={"h-64"}
                    />
                </CardContent>
            </Card>

        </>
    );
    
}