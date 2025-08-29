// src/components/tables/index.jsx
import { useNavigate } from "react-router-dom";
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Table, 
    TableHeader, 
    TableBody, 
    TableRow, 
    TableCell, 
    TableHead 
} from "@/components/ui/table";
import { RotateCcw } from "lucide-react";
import { useMemo } from "react";

// 小工具：對齊 class
const alignClass = (align = 'left') => (
  align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left'
);

const SortIcon = ({ state }) => {
  // state: null| 'asc' | 'desc'
  if (state === 'asc') return <span aria-hidden>▲</span>;
  if (state === 'desc') return <span aria-hidden>▼</span>;
  return <span aria-hidden>↕</span>;
};

const CustomTable = ({ 
    name = 'tabledata', 
    ariaLabel,
    emptyDataMsg = 'No data found.', 
    columns, 
    datas, 
    pageCount = 10,  
    
    // 新增
    isLoading = false,
    error = null,
    onRetry,
    onClearFilters,     // 空狀態 CTA
    density = 'comfy',  // 'comfy' | 'compact'
    highlightTerm = "", // <— 新增：關鍵字高亮
    rowClassName,       // <— 新增：依 row 設定 className

    // 排序（交由父層持有，以便與分頁協同）
    sort = { key: null, dir: null },
    onSortChange,
 }) => {
    const navigate = useNavigate();
    const testIdTable = name ? `${name}-table` : 'table';
    const testIdSkRow = name ? `${name}-skeleton-row` : 'skeleton-row';

    if(!columns || columns.length === 0) {
        return <>Table Display Error: Please check columns definition.</>
    }

    const nextDir = (dir) => (dir === null ? 'asc' : dir === 'asc' ? 'desc' : null);
    const handleSortClick = (col) => () => {
        if (!col.sortable || !onSortChange) return;
        const active = sort.key === col.key ? sort.dir : null;
        const dir = nextDir(active);
        onSortChange({ key: dir ? col.key : null, dir }); // dir 變 null 時取消排序
    };

    const highlightText = (text) => {
        if (!highlightTerm || !text) return text;
        const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const re = new RegExp(`(${esc(highlightTerm)})`, 'ig');
        const parts = String(text).split(re);

        return parts.map((p, i) =>
            i % 2 === 1 ? <mark key={i} className="rounded bg-yellow-200/60 px-0.5 dark:bg-yellow-300/30">{p}</mark> : p
        );
    };

    const renderDataColumn = (column, data) => {
        let result = null;
        
        if (column.render) {
            result = column.render({ rowData: data, column, value: data[column.key] });

        }
        else if (column.formatter) {
            result = column.formatter({ value: data[column.key]});
        }
        else {
           result = highlightText(data?.[column.key]);
        }

        return result;
    }
    // Skeleton 欄位寬度與對齊（降低畫面抖動）
    const skeletonCells = useMemo(() => {
        return columns?.map((c) => ({
        key: c.key,
        tdClass: `${alignClass(c.align)} ${c.tdClass || ''}`,
        widthClass: c.width || ''
        })) ?? [];
    }, [columns]);

    const TableAnnouncer = ({ state, rows }) => (
        <div className="sr-only" aria-live="polite" aria-atomic="true" data-testid="table-announcer">
        {state === 'loading' && '資料載入中…'}
        {state === 'error' && '載入失敗。'}
        {state === 'empty' && '沒有符合條件的資料。'}
        {state === 'ready' && `${rows ?? 0} 筆資料已載入。`}
        </div>
    );
    const rowPadCls = density === 'compact' ? 'py-1.5' : 'py-3';
    const skelH = density === 'compact' ? 'h-3' : 'h-4';

    return (
        <div className="w-full"> 
            <div className="max-h-[60vh] overflow-y-auto rounded-lg border">
                <Table 
                    data-testid={testIdTable}
                    aria-busy={isLoading ? "true" : "false"}
                    aria-label={ariaLabel}
                >
                    <TableHeader className="border-b">
                        <TableRow>
                            {
                                columns.map((column) => {
                                    const isActive = sort?.key === column.key && !!sort?.dir;

                                    return (
                                        <TableHead 
                                            role="columnheader"
                                            key={`${name}-table-header-${column.key}`}
                                            className={cn("sticky top-0 bg-background z-20 shadow-[inset_0_-1px_0_var(--border)] md:shadow-sm space-x-1", 
                                                alignClass(column.align), 
                                                "whitespace-nowrap",
                                                column.width || "",
                                                column.sortable && "cursor-pointer select-none",
                                                // 目前排序欄位高亮
                                                isActive && "bg-accent/30"
                                            )}
                                            aria-sort={isActive ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}
                                            aria-label={column.sortable ? `Sort by ${column.name}` : undefined}
                                            onClick={handleSortClick(column)}
                                            onKeyDown={
                                                column.sortable
                                                ? (e) => {
                                                    if (e.key === "Enter" || e.key === " ") {
                                                        e.preventDefault();
                                                        handleSortClick(column)();
                                                    }
                                                    }
                                                : undefined
                                            }
                                            data-sortable={column.sortable ? "true" : "false"} 
                                        >
                                            {column.sortable ? (
                                                    <>
                                                        <span>{column.name}</span>
                                                        <SortIcon state={isActive ? sort.dir : null} />
                                                    </>
                                                ) : (
                                                <span>{column.name}</span>
                                            )}
                                        </TableHead>
                                    );
                                })
                            }
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            // Skeleton：依欄位對齊/寬度呈現，避免位移
                            Array.from({ length: 6 }).map((_, i) => (
                                <TableRow 
                                    key={`sk-${i}`} 
                                    className={cn("border-b", skelH)}
                                    data-testid={testIdSkRow}
                                >
                                    {skeletonCells.map((c, idx) => (
                                        <TableCell key={`${name}-sk-${i}-${c.key}`} className={cn(c.tdClass, c.widthClass)}>
                                        <div className="h-4 w-full max-w-[80%] animate-pulse rounded bg-muted" />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : error ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center py-6">
                                    <div className="space-y-3">
                                        <p className="text-destructive font-medium">載入失敗：{error}</p>
                                        <div className="flex justify-center gap-2">
                                            {onRetry && (
                                            <Button variant="default" onClick={onRetry}>重新整理</Button>
                                            )}
                                        </div>
                                    </div>                                    
                                </TableCell>
                            </TableRow>
                        ) : datas && datas.length > 0 ? (
                            datas.map((data, index) => (
                                <TableRow 
                                    key={`table-row-${index}`} 
                                    // className="py-3 border-b hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    className={cn("group border-b hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", 
                                        rowPadCls,
                                        typeof rowClassName === 'function' ? rowClassName(data) : ""
                                    )}
                                    tabIndex={0}
                                    aria-label={`第 ${index + 1} 列`}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            // 若有 operation，觸發第一個 action
                                            const opCol = columns.find(c => c.key === 'operation');
                                            const first = opCol?.actions?.[0];
                                            if (first) first.action?.({ navigate, data });
                                        }
                                    }}
                                >
                                    {columns.map((column) => (
                                        <TableCell
                                            key={`${name}-table-row-${index}-cell-${column.key}`}
                                            className={`${alignClass(column.align)} ${column.tdClass || ''}`}
                                        >
                                        {column.key === 'operation' ? (
                                          <div className="flex items-center gap-1 opacity-70 text-muted-foreground group-hover:opacity-100 group-focus-within:opacity-100">
                                            {column?.actions?.map((action) => (
                                                <Button
                                                    key={action.id}
                                                    title="查看詳細"
                                                    variant="ghost"
                                                    onClick={() => action.action({ navigate, data })}
                                                    size={density === 'compact' ? "sm" : "default"}
                                                >
                                                    詳細
                                                </Button>
                                            ))}
                                          </div>
                                        ) : (
                                            <span data-testid={`cell-v-${column.key}`}>{renderDataColumn(column, data)}</span>
                                        )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="py-10">
                                    <div className="flex flex-col items-center gap-3 text-center">
                                    <div className="rounded-full border p-3 text-muted-foreground">
                                        <RotateCcw className="h-5 w-5" aria-hidden />
                                    </div>
                                    <p className="text-sm text-muted-foreground">{emptyDataMsg}</p>
                                    {onClearFilters && (
                                        <Button variant="outline" size="sm" onClick={onClearFilters}>
                                            清除篩選
                                        </Button>
                                    )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <TableAnnouncer 
                    state={
                        isLoading ? 'loading' :
                        error ? 'error' :
                        (datas?.length ?? 0) === 0 ? 'empty' : 'ready'
                    }
                    rows={datas?.length ?? 0}
                />                
            </div>
        </div>

    );    
}

export default CustomTable;