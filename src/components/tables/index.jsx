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
    emptyDataMsg = 'No data found.', 
    columns, 
    datas, 
    pageCount = 10,  
    
    // 新增
    isLoading = false,
    error = null,
    onRetry,

    // 排序（交由父層持有，以便與分頁協同）
    sort = { key: null, dir: null },
    onSortChange,
 }) => {
    const navigate = useNavigate();

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

    const renderDataColumn = (column, data) => {
        let result = null;

        if (column.render) {
            result = column.render({ rowData: data, column, value: data[column.key] });
        }
        else if (column.formatter) {
            result = column.formatter({ value: data[column.key]});
        }
        else {
            result = data?.[column.key];
        }

        return result;
    }

    return (
        <div className="w-full"> 
            <div className="max-h-[60vh] overflow-y-auto rounded-lg border">
                <Table data-testid="table-skeleton">
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
                                                `${alignClass(column.align)} ${column.width || ''}`, 
                                                "whitespace-nowrap",
                                                column.width || "",
                                                column.sortable && "cursor-pointer select-none"
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
                            // Skeleton（簡化）
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={`sk-${i}`} className="border-b">
                                    {columns.map((c) => (
                                        <TableCell key={`${name}-sk-${i}-${c.key}`}>
                                            <div className="h-4 w-full animate-pulse rounded bg-muted" />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : error ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center py-6">
                                <div className="space-y-2">
                                    <p className="text-destructive">{error}</p>
                                    {onRetry && (
                                    <Button variant="default" onClick={onRetry}>
                                        重新整理
                                    </Button>
                                    )}
                                </div>
                                </TableCell>
                            </TableRow>
                        ) : datas && datas.length > 0 ? (
                            datas.map((data, index) => (
                                <TableRow key={`table-row-${index}`} className="py-3 border-b hover:bg-muted/40">
                                    {columns.map((column) => (
                                        <TableCell
                                            key={`${name}-table-row-${index}-cell-${column.key}`}
                                            className={`${alignClass(column.align)} ${column.tdClass || ''}`}
                                        >
                                        {column.key === 'operation' ? (
                                            column?.actions?.map((action) => (
                                            <Button
                                                key={action.id}
                                                onClick={() => action.action({ navigate, data })}
                                            >
                                                詳細
                                            </Button>
                                            ))
                                        ) : (
                                            <span data-testid={`cell-v-${column.key}`}>{renderDataColumn(column, data)}</span>
                                        )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center text-muted-foreground py-4">
                                    {emptyDataMsg}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>

    );    
}

export default CustomTable;