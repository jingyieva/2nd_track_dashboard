// src/pages/Dashboard/KPICard.jsx
import { useEffect, useMemo, useState } from 'react';
import { Card, CardAction, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { TrendingUpIcon } from 'lucide-react'; // For theme toggle icons
import { Badge } from "@/components/ui/badge";

import { getKpis } from "@/actions/orders";
import { useFiltersStore } from "@/stores/filters";
import { resolveCurrentMonth } from '@/utils/date';

const fmt = (n) => (n == null ? '—' : Number(n).toLocaleString());

export default function KPICard() {
    const { platform } = useFiltersStore(); // KPI 固定取「本月」，但仍可受平台影響
    const monthRange = useMemo(() => resolveCurrentMonth(), []);
    const [data, setData] = useState({ monthAmount: 0, monthOrders: 0, grossRevenue: 0 });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let dead = false;
        (async () => {
            setLoading(true);
            try {
                const res = await getKpis({ ...monthRange, platform: platform || undefined });
                if (!dead) setData(res);
            } finally { if (!dead) setLoading(false); }
        })();
        return () => { dead = true; };
    }, [platform, monthRange.from, monthRange.to]);

    const Block = ({ title, value, delta = '+0%' }) => (
        <Card className="w-full min-w-0">
            <CardHeader>
                <CardDescription>{title}</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    {loading ? '…' : fmt(value)}
                </CardTitle>
                <CardAction>
                    <Badge variant="outline" className="gap-1">
                        <TrendingUpIcon className="size-3.5" />
                        {delta}
                    </Badge>
                </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                    本月統計 
                    <TrendingUpIcon className="size-4" /></div>
            </CardFooter>
        </Card>
    );

    return (
        <>
            <Block title="本月交易總金額" value={data.monthAmount} delta="+12.5%" />
            <Block title="本月訂單數量"   value={data.monthOrders}  delta="+10%" />
            <Block title="本月淨收入"   value={data.grossRevenue} delta="+5%" />
        </>
    );

}