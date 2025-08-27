// src/pages/Order.jsx
import { useEffect, useState, useRef, useMemo, useDeferredValue } from "react";

import { cn } from '@/lib/utils';

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button} from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { X, RotateCcw, SlidersHorizontal } from "lucide-react";

import { usePagination } from "@/hooks/usePagination";
import { useTableData } from "@/hooks/useTableData";

import Table from "@/components/tables";
import Pagination from '@/components/paginations';


const MOCK_ORDERS = [
  {
    order_id: "20250716001",
    order_date: "2025-07-16",
    platform: '蝦皮',
    commission_fee: 69,
    shipping_fee_payer: "買家",
    shipping_fee: 45,
    cost: 360,
    sales: 400,
    revenue: -29
  },
    {
    order_id: "20250716002",
    order_date: "2025-07-16",
    platform: '蝦皮',
    commission_fee: 12,
    shipping_fee_payer: "買家",
    shipping_fee: 45,
    cost: 0,
    sales: 150,
    revenue: 138
  },
    {
    order_id: "20250716003",
    order_date: "2025-07-16",
    platform: '蝦皮',
    commission_fee: 31,
    shipping_fee_payer: "買家",
    shipping_fee: 45,
    cost: 0,
    sales: 400,
    revenue: 369
  },
    {
    order_id: "20250716004",
    order_date: "2025-07-16",
    platform: '蝦皮',
    commission_fee: 176,
    shipping_fee_payer: "買家",
    shipping_fee: 45,
    cost: 0,
    sales: 2350,
    revenue: 2174
  },
    {
    order_id: "20250716005",
    order_date: "2025-07-16",
    platform: '蝦皮',
    commission_fee: 8,
    shipping_fee_payer: "買家",
    shipping_fee: 45,
    cost: 0,
    sales: 90,
    revenue: 82
  },
    {
    order_id: "20250716006",
    order_date: "2025-07-16",
    platform: '旋轉',
    commission_fee: 15,
    shipping_fee_payer: "買家",
    shipping_fee: 45,
    cost: 0,
    sales: 180,
    revenue: 165
  },
    {
    order_id: "20250716007",
    order_date: "2025-07-16",
    platform: '蝦皮',
    commission_fee: 69,
    shipping_fee_payer: "買家",
    shipping_fee: 45,
    cost: 0,
    sales: 400,
    revenue: 331
  },
    {
    order_id: "20250720001",
    order_date: "2025-07-20",
    platform: '旋轉',
    commission_fee: 15,
    shipping_fee_payer: "買家",
    shipping_fee: 45,
    cost: 0,
    sales: 150,
    revenue: 135
  },
    {
    order_id: "20250730001",
    order_date: "2025-07-30",
    platform: '蝦皮',
    commission_fee: 5,
    shipping_fee_payer: "買家",
    shipping_fee: 45,
    cost: 0,
    sales: 60,
    revenue: 55
  },
    {
    order_id: "20250730002",
    order_date: "2025-07-30",
    platform: '旋轉',
    commission_fee: 156,
    shipping_fee_payer: "買家",
    shipping_fee: 60,
    cost: 0,
    sales: 2600,
    revenue: 2384
  },
  {
    order_id: "20250801001",
    order_date: "2025-08-01",
    platform: '蝦皮',
    commission_fee: 11,
    shipping_fee_payer: "買家",
    shipping_fee: 45,
    cost: 0,
    sales: 120,
    revenue: 109
  },
];			

const COLUMN_DEFS = [
    {
        key: 'order_id',
        name: '訂單編號',
        sortable: true,
    },
    {
        key: 'order_date',
        name: '訂單日期',
        align:'center',
        formatter: ({ value }) => new Date(value).toLocaleDateString(),
    },
    {
        key: 'platform',
        name: '銷售平台',
        align:'center',
        render: ({ value }) => <Badge variant="secondary">{value}</Badge>
    },
    {
        key: 'commission_fee',
        name: '平台抽成金額',
        align:'right',
        formatter: ({ value }) => value?.toLocaleString?.() ?? '-', // 數字格式化
    },
    {
        key: 'shipping_fee_payer',
        name: '運費負擔方',
        align:'center',
    },
    {
        key: 'shipping_fee',
        name: '運費',
        align:'right',
        formatter: ({ value }) => value?.toLocaleString?.() ?? '-', // 數字格式化
    },
    {
        key: 'cost',
        name: '總成本',
        align:'right',
        formatter: ({ value }) => value?.toLocaleString?.() ?? '-', // 數字格式化
    },
    {
        key: 'sales',
        name: '訂單總金額',
        align:'right',
        formatter: ({ value }) => value?.toLocaleString?.() ?? '-', // 數字格式化
    },
    {
        key: 'revenue',
        name: '淨收入',
        align:'right',
        width: 'w-[130px]',
        sortable:true,
        formatter: ({ value }) => {
            const n = Number(value);
            return (
                <Badge data-testid={'revenue'} variant={n < 0 ? "destructive" : "success"}>
                    {n.toLocaleString()}
                </Badge>
            )
        }
    },
    {
        key: 'operation',
        name: '操作',
        actions: [ 
            {
                id: 'toOrderDetail',
                action: ({ navigate , data }) => {
                    navigate(`order/${data.order_id}`)
                }
            },
        ]
    }
]

function Bubble({ value, leftPct, yShift = 0 }) {
  return (
    <span 
        className={cn(
            "absolute -translate-x-1/2 rounded bg-muted px-1.5 py-0.5 text-xs tabular-nums",
            "pointer-events-none select-none z-10"
        )}
        style={{
            left: `clamp(12px, ${leftPct}%, calc(100% - 12px))`,
            transform: `translateX(-50%) translateY(${yShift}px)`,
        }}
    >
      {value.toLocaleString()}
    </span>
  );
}

export function RangeSliderBubbles({ min, max, step = 100, value, onChange, onCommit }) {
    const [lo, hi] = value ?? [min, max]

    // 轉百分比位置，避免除以 0
    const pct = (v) => {
        const span = Math.max(1, max - min)
        return ((v - min) / span) * 100
    }

    // 兩顆太靠近時，讓上限那顆往上 12px，避免重疊
    const { loPct, hiPct, hiShift } = useMemo(() => {
        const lp = pct(lo)
        const hp = pct(hi)
        const tooClose = Math.abs(hp - lp) < 6 // 門檻可依 UI 微調
        return { loPct: lp, hiPct: hp, hiShift: tooClose ? -12 : 0 }
    }, [lo, hi])

    return (
        <div className="relative w-full px-2 pt-6">
            {/* badge 在上層，先畫 */}
            <div className="pointer-events-none absolute inset-x-0 top-0 z-30">
                <Bubble value={lo} leftPct={loPct} />
                <Bubble value={hi} leftPct={hiPct} yShift={hiShift} />
            </div>

            {/* slider 本體 */}
            <Slider
                min={min}
                max={max}
                step={step}
                value={[lo, hi]}
                onValueChange={onChange}
                onValueCommit={onCommit}
            />
        </div>
    )
}

export default function Orders (){
    const [raw] = useState(MOCK_ORDERS);
    const tableRef = useRef(null);

    // --- 新增：篩選與排序的本地狀態 ---
    const [keyword, setKeyword] = useState("");
    const deferredKeyword = useDeferredValue(keyword);
    const effectiveKeyword = keyword === "" ? "" : deferredKeyword;
    const [platform, setPlatform] = useState(""); // 空字串=全部
    const [sort, setSort] = useState({ key: null, dir: null });
    
    // 1) 由資料動態取得淨收入上下限（domain）
    const revenueDomain = useMemo(() => {
        if (!raw?.length) return { min: 0, max: 0 };
        let min = Infinity, max = -Infinity;
        for (const r of raw) {
            const n = Number(r.revenue);
            if (!Number.isNaN(n)) {
            if (n < min) min = n;
            if (n > max) max = n;
            }
        }
        // 保守一點：給 0.05 的邊界緩衝
        const pad = Math.round((max - min) * 0.05);
        return { min: Math.floor(min - pad), max: Math.ceil(max + pad) };
    }, [raw]);

    // 2) 控制值（雙滑塊的當前區間）
    const [revRange, setRevRange] = useState([revenueDomain.min, revenueDomain.max]);
        // 若 domain 改變（首次載入），同步初始值
        useEffect(() => {
        setRevRange([revenueDomain.min, revenueDomain.max]);
    }, [revenueDomain.min, revenueDomain.max]);

    // 3) 可選：分離「即時拖曳」與「提交後才分頁歸 1」的行為
    // const onRangeChange = (vals) => setRevRange(vals);
    const onRangeCommit = () => switchPage(1); // 拖完（鬆手）才回到第 1 頁，避免拖動中頁碼抖動

    // 4) 將拉桿值送進 useTableData 的 filters（取代原本 revenueMin/Max）
    const filters = useMemo(() => ({
        keyword: effectiveKeyword,
        selects: { platform: platform || null },
        ranges: {
            revenue: {
                min: revRange?.[0] ?? null,
                max: revRange?.[1] ?? null,
            },
        },
    }), [effectiveKeyword, platform, revRange]);

    // 5) Reset
    const resetRange = () => {
        setRevRange([revenueDomain.min, revenueDomain.max]);
        switchPage(1);
    };

    const { rows: selectedRows, total } = useTableData({
      data: raw,
      columns: COLUMN_DEFS,
      filters,
      sort,
    });

    const { currentPage, 
        switchPage, 
        changePageSize,
        currentData, 
        totalPages, 
        paginationRange, pageSize 
    } = usePagination({
            datas: selectedRows, totalCount: total, 
            scrollTargetRef: tableRef,
            scrollOffset: 80, // 預留空間給固定 header
    });

    const resetAll = () => {
        setKeyword("");
        setPlatform("__ALL__");
        setRevRange([revenueDomain.min, revenueDomain.max]);
        switchPage(1);
    };


    // 篩選變動時，切回第 1 頁（usePagination 已在 changePageSize/switchPage 內處理滾動）
    useEffect(() => { 
        switchPage(1); 
    }, [keyword, platform]); // eslint-disable-line 

    return (
        <div className="p-6 space-y-4">
            <h2 className="text-2xl font-bold">訂單列表</h2>
            {/* 控制列：Quick Filter + 平台 Select */}
            <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2">
                    <div className="relative w-[220px]">
                        <Input
                            aria-label="快速搜尋"
                            placeholder="搜尋訂單編號/平台/金額…"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            className="pr-9"
                        />
                        {keyword && (
                            <button
                                type="button"
                                aria-label="清除搜尋"
                                onClick={() => { setKeyword(""); switchPage(1); }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 grid h-6 w-6 place-items-center rounded hover:bg-muted"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                    <Select
                        value={platform}
                        onValueChange={(v) => setPlatform(v === "__ALL__" ? "" : v)}
                    >
                    <SelectTrigger aria-label="平台篩選" className="w-[140px]">
                        <SelectValue placeholder="全部平台" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem data-testid="select-item-all" value="__ALL__">全部平台</SelectItem>
                        {
                            ['蝦皮', '旋轉', '其他'].map((p) => (

                                <SelectItem key={`select-item-${p}`} data-testid={`select-item-${p}`} value={p}>{p}</SelectItem>
                            ))
                        }
                    </SelectContent>
                    </Select>
                </div>
                {/* Revenue 區間：雙滑塊 + 精準輸入 */}
                {/* <div className="flex items-center gap-2"> */}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                            <SlidersHorizontal className="h-4 w-4" />
                            進階篩選
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[360px] space-y-4">
                        <div className="space-y-2">
                            <h4 className="text-sm text-muted-foreground">淨收入</h4>
                            <div className="flex items-center gap-3">
                                <Input
                                    type="number"
                                    inputMode="numeric"
                                    aria-label="收入下限"
                                    className="h-8 w-[120px] tabular-nums"
                                    value={revRange[0]}
                                    onChange={(e) => {
                                        const v = Number(e.target.value);
                                        setRevRange(([_, hi]) => [
                                            Math.min(Math.max(v, revenueDomain.min), hi), hi
                                        ]);
                                    }}
                                    onBlur={onRangeCommit}
                                />
                                <span>~</span>
                                <Input
                                    type="number"
                                    inputMode="numeric"
                                    aria-label="收入上限"
                                    className="h-8 w-[120px] tabular-nums"
                                    value={revRange[1]}
                                    onChange={(e) => {
                                        const v = Number(e.target.value);
                                        setRevRange(([lo, _]) => [
                                            lo, Math.max(Math.min(v, revenueDomain.max), lo)
                                        ]);
                                    }}
                                    onBlur={onRangeCommit}
                                />
                            </div>
                            {/* 拉桿本體：雙滑塊 */}
                                <div className="flex px-2">
                                    <RangeSliderBubbles
                                        min={revenueDomain.min}
                                        max={revenueDomain.max}
                                        step={100}
                                        value={revRange}
                                        onChange={setRevRange}
                                        onCommit={() => switchPage(1)}
                                    />
                                    <button
                                        type="button"
                                        onClick={resetRange}
                                        className="text-sm underline text-muted-foreground hover:text-foreground"
                                    >
                                        <RotateCcw />
                                    </button>
                                </div>
                        </div>
                    </PopoverContent>
                </Popover>
                <div className="ml-auto">
                    <button
                        type="button"
                        className="text-sm text-muted-foreground hover:text-foreground underline"
                        onClick={resetAll}
                    >
                        清除全部篩選
                    </button>
                </div>
            </div>
            <Card>
                <CardContent className="p-1" ref={tableRef}>
                    <Table
                        aria-label="訂單列表"
                        name="order"
                        columns={COLUMN_DEFS}
                        datas={currentData}
                        emptyDataMsg="No order found."
                      
                        // 新增：錯誤/載入（示意；目前 raw 為同步）
                        isLoading={false}
                        error={null}
                        onRetry={null}

                        // 排序：交給 Table 的表頭按鈕切換
                        sort={sort}
                        onSortChange={setSort}
                    />
                    <Pagination 
                        paginationRange={paginationRange}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        switchPage={switchPage}
                        pageSize={pageSize}
                        changePageSize={changePageSize}
                    />
                </CardContent>
            </Card>
        </div>
    )
}