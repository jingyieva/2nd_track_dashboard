import { Card, CardAction, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChartRenderer } from '@/components/charts/ChartRenderer';
import { TrendingDownIcon, TrendingUpIcon } from 'lucide-react'; // For theme toggle icons

export default function Dashboard (){

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                    <CardHeader>
                    <CardDescription>Total Revenue</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        $1,250.00
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline">
                        <TrendingUpIcon />
                        +12.5%
                        </Badge>
                    </CardAction>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        Trending up this month <TrendingUpIcon className="size-4" />
                    </div>
                    <div className="text-muted-foreground">
                        Visitors for the last 6 months
                    </div>
                    </CardFooter>
                </Card>
              <Card>
                <CardHeader>
                    <CardTitle>熱門類別</CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartRenderer  
                        variant='Bar'
                        data={{
                            labels: ['電器', '家具', '書籍', '服飾', '其他'],
                            datas: [
                                {
                                    label: '各種類銷售量',
                                    data: [12, 19, 8, 5, 14],
                                },
                            ],
                        }}
                        className={"h-64"}
                    />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>交易狀態統計</CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartRenderer  
                        variant='Pie'
                        data={{
                            labels: ['已售出', '上架中', '保留中'],
                            datas: [{
                                label: '交易狀態',
                                data: [25, 15, 5],
                                borderWidth: 0,
                                },
                            ],
                        }}
                        className={"h-64"}
                    />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>月交易趨勢</CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartRenderer  
                        variant='Line'
                        data={{
                            labels: ['2025-05', '2025-06', '2025-07'],
                            datas: [
                                {
                                    label: '交易數量',
                                    data: [2, 5, 10],
                                },
                            ],
                        }}
                        className={"h-64"}
                    />
                </CardContent>
            </Card>
            
        </div>
    )
}