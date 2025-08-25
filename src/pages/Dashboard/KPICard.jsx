// src/pages/Dashboard/index.jsx

import { Card, CardAction, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { TrendingUpIcon } from 'lucide-react'; // For theme toggle icons
import { Badge } from "@/components/ui/badge"

export default function KPICard() {

    return (
        <>
            <Card className="w-full min-w-0">
                <CardHeader>
                    <CardDescription>本月總交易金額</CardDescription>
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
                </CardFooter>
                
            </Card>
            <Card className="w-full min-w-0">
                <CardHeader>
                    <CardDescription>本月訂單數量</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        15
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline">
                        <TrendingUpIcon />
                        +10%
                        </Badge>
                </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        Trending up this month <TrendingUpIcon className="size-4" />
                    </div>
                </CardFooter>
                
            </Card>
            <Card className="w-full min-w-0">
                <CardHeader>
                    <CardDescription>營業總額</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        3240
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline">
                        <TrendingUpIcon />
                        +5%
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        Trending up this month <TrendingUpIcon className="size-4" />
                    </div>
                </CardFooter>
                
            </Card>
        </>
    );

}