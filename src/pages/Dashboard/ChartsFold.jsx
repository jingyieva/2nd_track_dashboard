// src/pages/Dashboard/ChartsFold.jsx
import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// store
import { useFiltersStore } from "@/stores/filters";
// utils
import { resolveRangeByPreset } from "@/utils/date";
// actions
import { getTrendStats, getPlatformStats, getCategoryStats, getSalesRevenueScatter } from "@/actions/orders";
// custom components
import { ChartRenderer } from '@/components/charts/ChartRenderer';
import VisuallyHidden from "@/components/a11y/VisuallyHidden";
import ChartA11y from "@/components/a11y/ChartA11y";
/** constants */
import { PLATFORMS } from "@/constants";

const PlatformScatterTooltip = ({ active, payload }) => {

    if (!active || !payload?.length) return null;

    // Recharts 會把該點的原始資料放在 payload[0].payload
    const d = payload[0]?.payload ?? {};
    const dateStr = d.order_date
        ? new Date(d.order_date).toLocaleDateString()
        : "";

    const srText = [
        dateStr ? `${dateStr}` : null,
        d.order_id ? `訂單編號 ${d.order_id}` : null,
        d.platform ? `平台 ${platformLabel(d.platform)}` : null,
        `銷售額 ${Number(d.sales).toLocaleString()}`,
        `淨收入 ${Number(d.revenue).toLocaleString()}`
    ].filter(Boolean).join("，");

    function platformLabel(v) {
        if (v === 'shopee') return '蝦皮';
        if (v === 'ruten' || v === 'carousell') return '旋轉';
        if (v === 'other') return '其他';
        return v;
    }

    return (
        <div className="rounded-md bg-popover px-3 py-2 text-popover-foreground shadow-md ring-1 ring-border">
            {/* 標題：日期 + 訂單編號 */}
            <div className="text-sm font-medium mb-1">
                {dateStr} <br /> {d.id ? ` ${d.id}` : ""}
            </div>

            {/* 內容列 */}
            <div className="text-sm space-y-0.5">
                <div>銷售額：{Number(d.sales ?? payload[0]?.value).toLocaleString()}</div>
                <div>淨收入：{Number(d.revenue ?? payload[1]?.value).toLocaleString()}</div>
            </div>
            <VisuallyHidden aria-live="polite">{srText}</VisuallyHidden>
        </div>
    );
}

const PlatformScatterLegend = ({ legendKeys, legendMaps, availableKeys }) => {

    return (
        <ul className="flex flex-wrap justify-center gap-3 text-sm" role="list" aria-label="平台圖例 (有資料者醒目顯示)">
            {legendKeys.map((key) => {
                const ui = legendMaps[key] ?? { label: key, color: "#888" };
                const hasData = availableKeys.has(key);
                return (
                    <li key={key} className="flex items-center gap-1" aria-label={`${ui.label} ${hasData ? '有資料' : '無資料'}`}>
                        <span
                            aria-hidden="true"
                            className="inline-block size-3 rounded-full"
                            style={{ background: hasData ? ui.color : "var(--muted-foreground)" }}
                        />
                        <span className={hasData ? "" : "text-muted-foreground"}>{ui.label}</span>
                    </li>
                );
            })}
        </ul>
    );
}

export default function ChartsFold() {
    const { preset, platform } = useFiltersStore();
    const range = useMemo(() => resolveRangeByPreset(preset), [preset]);

    // 1) 交易趨勢統計（Line）
    const [trend, setTrend] = useState([]);
    // 2) 平台交易統計（Bar）
    const [platforms, setPlatforms] = useState([]);
    // 3) 商品類別占比（Pie）
    const [categories, setCategories] = useState([]);
    // 4) 銷售額 vs 淨收入分布
    const [scatter, setScatter] = useState({ datas: [], total: 0, loading: true, error: null, meta: {} });

    const [loading, setLoading] = useState({ trend: false, platforms: false, categories: false });
    const setLoad = (k, v) => setLoading((s) => ({ ...s, [k]: v }));

    // 5) 建立完整清單與「本次有資料」集合
    const allKeys = scatter.meta?.platformsAll ?? Object.keys(PLATFORMS);
    const availableKeys = new Set(scatter.meta?.platformsAvailable ?? scatter.datas?.map(d => d.platform));

    const platformLegend = <PlatformScatterLegend legendKeys={allKeys} legendMaps={PLATFORMS} availableKeys={availableKeys} />

    useEffect(() => {
        let dead = false;
        (async () => {
            setLoad('trend', true);
            try {
                const res = await getTrendStats({ ...range, platform: platform || undefined });
                if (!dead) setTrend(res?.datas ?? []);
            } finally { if (!dead) setLoad('trend', false); }
        })();
        return () => { dead = true; };
    }, [range.from, range.to, platform]);

    useEffect(() => {
        let dead = false;
        (async () => {
            setLoad('platforms', true);
            try {
                const res = await getPlatformStats({ ...range });
                if (!dead) setPlatforms(res?.datas ?? []);
            } finally { if (!dead) setLoad('platforms', false); }
        })();
        return () => { dead = true; };
    }, [range.from, range.to]);

    useEffect(() => {
        let dead = false;
        (async () => {
            setLoad('categories', true);
            try {
                const res = await getCategoryStats({ ...range });
                if (!dead) setCategories(res?.datas ?? []);
            } finally { if (!dead) setLoad('categories', false); }
        })();
        return () => { dead = true; };
    }, [range.from, range.to]);

    useEffect(() => {
        let dead = false;
        (async () => {
            setLoad('scatter', true);
            try {
                const res = await getSalesRevenueScatter({ ...range, platform: platform || undefined });
                if (!dead) setScatter(res);
            } finally { if (!dead) setLoad('scatter', false); }
        })();
        return () => { dead = true; };

    }, [range.from, range.to, platform]);

    return (
        <>
            <Card className="w-full min-w-0 md:col-span-2 lg:col-span-3">
                <CardHeader>
                    <CardTitle id="chart-title-trend">交易趨勢統計</CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartA11y
                        titleId="chart-title-trend"
                        descId="chart-desc-trend"
                        descText={`顯示 ${new Date(range.from).toLocaleDateString()} 至 ${new Date(range.to).toLocaleDateString()} 的交易金額趨勢線圖。${platform ? `目前僅顯示${PLATFORMS[platform]}平台。` : "包含所有平台。"} 資料點數：${trend.length}。`}
                    >
                        <ChartRenderer
                            name="trend-statistics"
                            variant='Line'
                            data={trend}
                            options={{
                                container: {
                                    date: { label: "日期", color: "var(--chart-1)" },
                                    orders: { label: "訂單數" },
                                    totalSales: { label: "交易金額" },
                                },
                                chart: {
                                    xAxisField: 'date',
                                    yAxisField: 'totalSales',   // 你也可切成 'orders'
                                    sizeField: 'platform',
                                    showYLabel: false,
                                }
                            }}
                            className={"h-64"}
                        />
                    </ChartA11y>
                </CardContent>
            </Card>
            <Card className="w-full min-w-0 md:col-span-2 lg:col-span-1">
                <CardHeader>
                    <CardTitle id="chart-title-platform">銷售平台交易統計</CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartA11y
                        titleId="chart-title-platform"
                        descId="chart-desc-platform"
                        descText={`顯示 ${new Date(range.from).toLocaleDateString()} 至 ${new Date(range.to).toLocaleDateString()} 各平台交易總額的長條圖。`}
                    >
                        <ChartRenderer
                            name="platform-statistics"
                            variant='Bar'
                            data={platforms.map(p => ({
                                platform: p.platform === 'shopee' ? '蝦皮' : p.platform === 'carousell' ? '旋轉' : '其他',
                                totalSales: p.totalSales,
                            }))}
                            options={{
                                container: {
                                    platform: { label: "平台", color: "var(--chart-1)" },
                                    totalSales: { label: "交易總額" },
                                },
                                chart: {
                                    xAxisField: 'platform',
                                    yAxisField: 'totalSales',
                                    isHorizontal: true,
                                }
                            }}
                            className={"h-64"}
                        />
                    </ChartA11y>
                </CardContent>
            </Card>

            <Card className="w-full min-w-0 md:col-span-2">
                <CardHeader>
                    <CardTitle id="chart-title-popular">熱門商品瀏覽次數排行</CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartA11y
                        titleId="chart-title-popular"
                        descId="chart-desc-popular"
                        descText="顯示近一段期間瀏覽次數最高的商品列表，數值為瀏覽次數。"
                    >
                        <ChartRenderer
                            name="popular-product"
                            variant='Bar'
                            data={[
                                { productType: "Google Chrome TV", views: 85 },
                                { productType: "戽斗星球", views: 72 },
                                { productType: "來貘杯緣子", views: 60 },
                                { productType: "皮卡丘存錢筒", views: 55 },
                                { productType: "運動短褲", views: 40 },
                                { productType: "護髮油", views: 5 },
                            ]}
                            options={{
                                container: {
                                    productType: {
                                        label: "productType",
                                        color: "var(--chart-1)",
                                    },
                                    views: {
                                        label: "views",
                                        color: "var(--chart-1)",
                                    },
                                },
                                chart: {
                                    xAxisField: 'productType',
                                    yAxisField: 'views',
                                    isHorizontal: true,
                                }
                            }}
                            className={"h-64"}
                        />
                    </ChartA11y>
                </CardContent>
            </Card>
            <Card className="w-full min-w-0 md:col-span-2 ">
                <CardHeader>
                    <CardTitle id="chart-title-scatter">銷售額 vs 淨收入分佈圖</CardTitle>
                </CardHeader>
                <CardContent className="h-64">
                    <ChartA11y
                        titleId="chart-title-scatter"
                        descId="chart-desc-scatter"
                        descText={`散點圖比較單筆訂單的銷售額（X 軸）與淨收入（Y 軸），顏色代表平台。${platform ? `目前僅顯示${PLATFORMS[platform]}平台。` : "包含所有平台。"} 點數：${scatter?.datas?.length ?? 0}。`}
                    >
                        <ChartRenderer
                            name="sales-revenue-scatter"
                            variant="Scatter"
                            data={scatter.datas}
                            options={{
                                container: {
                                    sales: { label: "銷售額", formatter: (n) => n.toLocaleString() },
                                    revenue: { label: "淨收入", formatter: (n) => n.toLocaleString() },
                                    // 針對各平台註冊顏色（可選）
                                    shopee: { color: "var(--chart-1)" },
                                    carousell: { color: "var(--chart-2)" },
                                    other: { color: "var(--chart-3)" },
                                },
                                chart: {
                                    xAxisField: "sales",
                                    yAxisField: "revenue",
                                    colorField: "platform", // 以平台分群上色
                                    // sizeField: "count",   // 若想用氣泡大小，可補這個欄位
                                    showLegend: true,
                                    a11y: { enableDotTitle: true }
                                },
                            }}
                            legendContent={platformLegend}
                            tooltipContent={PlatformScatterTooltip}
                            className={"h-64"}
                        />
                    </ChartA11y>
                </CardContent>
            </Card>

            <Card className="w-full min-w-0 md:col-span-1">
                <CardHeader>
                    <CardTitle id="chart-title-category">各商品類別銷售占比</CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartA11y
                        titleId="chart-title-category"
                        descId="chart-desc-category"
                        descText="圓環圖顯示各商品類別於篩選期間的銷售額占比，中央數字為總額。"
                    >
                        <ChartRenderer
                            name="product-type"
                            variant='Pie'
                            data={categories.reduce((prev, cur, curIndex) => {
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
                                    total: {
                                        label: "Total",
                                    },
                                    ...(categories.reduce((prev, cur, curIndex) => {
                                        return ({
                                            ...prev,
                                            [`${cur.type}`]: {
                                                label: `${cur.type}`,
                                                color: `var(--chart-${curIndex + 1})`,
                                            }
                                        });
                                    }, {}))
                                },
                                chart: {
                                    totalLabel: 'Total',
                                    xAxisField: 'type',
                                    yAxisField: 'totalSales',

                                }
                            }}
                            className={"h-64"}
                        />
                    </ChartA11y>
                </CardContent>
            </Card>

        </>
    );

}