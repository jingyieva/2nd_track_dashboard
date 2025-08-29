// src/pages/Order.jsx
import { useEffect, useState, useRef, useMemo, useDeferredValue } from "react";

import { cn } from '@/lib/utils';

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button} from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { Slider } from "@/components/ui/slider";
import { X, RotateCcw, SlidersHorizontal, Copy, Check } from "lucide-react";

import { usePagination } from "@/hooks/usePagination";
import { useTableData } from "@/hooks/useTableData";

import Table from "@/components/tables";
import Pagination from '@/components/paginations';
import HL from '@/components/Highlight';


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

function CopyOrderId({ value, copyText}) {
    const [copied, setCopied] = useState(false);
    const [open, setOpen] = useState(false); 
    const [announce, setAnnounce] = useState("");
    const timerRef = useRef(null);
    const DURATION = 1600;

    const doCopy = async () => {
        try {
            await navigator.clipboard.writeText(String(copyText ?? ""));
            setCopied(true);
            setOpen(true);
            setAnnounce(`已複製訂單編號 ${copyText}`);
            window.clearTimeout(timerRef.current);
            timerRef.current = window.setTimeout(() => {
                setCopied(false);
                setOpen(false);  // 到時間再關
                setAnnounce("");
            }, DURATION);
        } catch {
            // 失敗就略過，不阻斷操作
        }
    };
    
    useEffect(() => () => window.clearTimeout(timerRef.current), []);

    return (
        <div className="inline-flex items-center gap-1 font-mono tabular-nums">
            {typeof value === 'function' ? (value) : (<span>{value}</span>) }
            <TooltipProvider delayDuration={150}>
                <Tooltip
                    open={open}
                    // 在「已複製」期間忽略 hover 導致的關閉，維持釘住效果
                    onOpenChange={(next) => {
                        if (copied) return; // pinned
                        setOpen(next);
                    }}                
                >
                    <TooltipTrigger asChild>
                        <button
                        type="button"
                        onClick={doCopy}
                        aria-label={copied ? "已複製" : "複製訂單編號"}
                        className="rounded p-1 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" sideOffset={6}  className="px-2 py-1 text-xs">
                        {copied ? "已複製！" : "複製"}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            {/* ARIA 朗讀用 */}
            <span className="sr-only" aria-live="polite">{announce}</span>
        </div>
    );
}



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

const getColumnDefs = (term) => ([
    {
        key: 'order_id',
        name: '訂單編號',
        sortable: true,
        render: ({ value }) => (
            <CopyOrderId 
                copyText={value}  
                value={(
                    <HL text={value} term={term} />
                )}
            />
        ),
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
        render: ({ value }) => <Badge variant="secondary"><HL text={value} term={term} /></Badge>
    },
    {
        key: 'commission_fee',
        name: '平台抽成金額',
        align:'right',
        tdClass: 'tabular-nums',
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
        tdClass: 'tabular-nums',
        formatter: ({ value }) => value?.toLocaleString?.() ?? '-', // 數字格式化
    },
    {
        key: 'cost',
        name: '總成本',
        align:'right',
        tdClass: 'tabular-nums',
        formatter: ({ value }) => value?.toLocaleString?.() ?? '-', // 數字格式化
    },
    {
        key: 'sales',
        name: '訂單總金額',
        align:'right',
        tdClass: 'tabular-nums',
        formatter: ({ value }) => value?.toLocaleString?.() ?? '-', // 數字格式化
    },
    {
        key: 'revenue',
        name: '淨收入',
        align:'right',
        width: 'w-[130px]',
        tdClass: 'tabular-nums',
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
]);

export default function Orders (){
    const [raw] = useState(MOCK_ORDERS);
    const tableRef = useRef(null);
    const searchRef = useRef(null);
    
    // --- 新增：篩選與排序的本地狀態 ---
    const [keyword, setKeyword] = useState("");
    const columns = useMemo(() => getColumnDefs(keyword), [keyword]);
    const deferredKeyword = useDeferredValue(keyword);
    const effectiveKeyword = keyword === "" ? "" : deferredKeyword;
    const [platform, setPlatform] = useState(""); // 空字串=全部
    const [sort, setSort] = useState({ key: null, dir: null });
    const [density, setDensity] = useState('comfy'); // 'comfy' | 'compact'

    // 測試環境不啟用 busy，避免 skeleton 影響 DOM 查詢
    const [isBusy, setIsBusy] = useState(false); // 樂觀載入旗標
    const isTest = typeof process !== 'undefined' && process.env?.NODE_ENV === 'test';
    const BUSY_MS = isTest ? 0 : 250;
    
    // 1) 由資料動態取得淨收入上下限（domain）
    const revenueDomain = useMemo(() => { 
        if (!raw?.length) {
            return { min: 0, max: 0 };
        }
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
      columns,
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

    // --- 樂觀載入：在互動後短暫呈現 skeleton，避免空白 / 抽動 ---
    const triggerBusy = () => {
        if (isTest) return; 
        setIsBusy(true);
        window.clearTimeout(triggerBusy._t);
        triggerBusy._t = window.setTimeout(() => setIsBusy(false), BUSY_MS);
    };

    // 包一層：換頁 / 換頁大小 / 排序 時觸發 busy
    const onSwitchPage = (p) => { triggerBusy(); switchPage(p); };
    const onChangePageSize = (s) => { triggerBusy(); changePageSize(s); };
    const onSortChange = (cfg) => { triggerBusy(); setSort(cfg); };

    const resetAll = () => {
        setKeyword("");
        setPlatform("");
        setRevRange([revenueDomain.min, revenueDomain.max]);
        onSwitchPage(1);
    };

    // --- 快捷鍵：全域 `/` 聚焦搜尋；搜尋框中按 Esc 清空 ---
    useEffect(() => {
      const isTypingTarget = (el) => {
        if (!el) return false;
        const tag = el.tagName?.toLowerCase();
        const editable = el.getAttribute?.('contenteditable');
        return ['input','textarea','select','button'].includes(tag) || editable === 'true';
      };
      const onKey = (e) => {
        // `/` 聚焦搜尋（避免在輸入框內時攔截）
        if (e.key === '/' && !e.metaKey && !e.ctrlKey && !e.altKey) {
            if (isTypingTarget(document.activeElement)) return;
            e.preventDefault();
            searchRef.current?.focus();
        }
        // 在搜尋框時按 Esc 清空
        if (e.key === 'Escape' && document.activeElement === searchRef.current && keyword) {
            setKeyword("");
            onSwitchPage(1);
        }
      };
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }, [keyword]); // eslint-disable-line

    // --- 是否有套用篩選，用於顯示 Chips 區塊 ---
    const hasKeyword = !!keyword;
    const hasPlatform = !!platform;
    const hasRevRange =
      (revRange?.[0] ?? revenueDomain.min) > revenueDomain.min ||
      (revRange?.[1] ?? revenueDomain.max) < revenueDomain.max;

    const clearKeyword = () => { setKeyword(""); onSwitchPage(1); };
    const clearPlatform = () => { setPlatform(""); onSwitchPage(1); };
    const clearRevRange = () => { resetRange(); onSwitchPage(1); };

    // 傳給 Table 空狀態 CTA
    const handleClearFilters = () => {
      resetAll();
    };

    // 篩選變動時，切回第 1 頁（usePagination 已在 changePageSize/switchPage 內處理滾動）
    useEffect(() => { 
        triggerBusy();
        onSwitchPage(1);
    }, [keyword, platform]); // eslint-disable-line 

    return (
        <div className="p-6 space-y-4">
            <h2 className="text-2xl font-bold">訂單列表</h2>
            {/* 控制列：Quick Filter + 平台 Select */}
            <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2">
                    <div className="relative w-[220px]">
                        <Input
                            ref={searchRef}
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
                {/* 密度切換 */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">密度</span>
                  <Select value={density} onValueChange={setDensity}>
                    <SelectTrigger aria-label="表格密度" className="h-8 w-[120px]">
                      <SelectValue placeholder="舒適" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="comfy">舒適</SelectItem>
                      <SelectItem value="compact">緊湊</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

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
            {/* 篩選 Chips（可個別移除） */}
            {(hasKeyword || hasPlatform || hasRevRange) && (
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="text-muted-foreground">已套用：</span>
                {hasKeyword && (
                  <Badge variant="secondary" className="gap-1">
                    關鍵字：{keyword}
                    <button
                      type="button"
                      aria-label="移除關鍵字篩選"
                      className="ml-1 rounded hover:bg-muted"
                      onClick={clearKeyword}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </Badge>
                )}
                {hasPlatform && (
                  <Badge variant="secondary" className="gap-1">
                    平台：{platform}
                    <button
                      type="button"
                      aria-label="移除平台篩選"
                      className="ml-1 rounded hover:bg-muted"
                      onClick={clearPlatform}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </Badge>
                )}
                {hasRevRange && (
                  <Badge variant="secondary" className="gap-1 tabular-nums">
                    淨收入：{revRange[0].toLocaleString()} ~ {revRange[1].toLocaleString()}
                    <button
                      type="button"
                      aria-label="移除淨收入篩選"
                      className="ml-1 rounded hover:bg-muted"
                      onClick={clearRevRange}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </Badge>
                )}
              </div>
            )}
            <Card>
                <CardContent className="p-1" ref={tableRef}>
                    <Table
                        ariaLabel="訂單列表"
                        name="order"
                        columns={columns}
                        datas={currentData}
                        emptyDataMsg="No order found."
                        density={density}
                        highlightTerm={keyword}
                        // 整列顏色 follow 淨收入的狀態
                        rowClassName={(row) => Number(row.revenue) < 0 ? "bg-destructive/5" : ""}
                      
                        // 新增：錯誤/載入（示意；目前 raw 為同步）
                        isLoading={isBusy}
                        error={null}
                        onRetry={null}
                        onClearFilters={handleClearFilters}

                        // 排序：交給 Table 的表頭按鈕切換
                        sort={sort}
                        onSortChange={onSortChange}
                    />
                    <Pagination 
                        paginationRange={paginationRange}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        switchPage={onSwitchPage}
                        pageSize={pageSize}
                        changePageSize={onChangePageSize}
                    />
                </CardContent>
            </Card>
        </div>
    )
}