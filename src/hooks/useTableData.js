// src/hooks/useTableData.js
import { useMemo } from "react";

/**
 * sort = { key: string|null, dir: 'asc'|'desc'|null }
 * filters = { keyword?: string, selects?: { [field]: string|null }, ranges?: { [field]: { min?: number|null, max?: number|null } } }
 */
export function useTableData({ data, columns, filters, sort }) {

    const filtered = useMemo(() => {
        if (!data) return [];

        const kw = (filters?.keyword || "").trim().toLowerCase();
        const selects = filters?.selects || {};
        const ranges = filters?.ranges || {};

        let out = data;

        // Quick filter：掃描所有 column.key
        if (kw) {
            out = out.filter((row) =>
              columns.some((col) => {
                const raw = row?.[col.key];
                const text = typeof col?.searchText === "function"
                  ? col.searchText(raw, row)
                  : raw;

                return String(text ?? "").toLowerCase().includes(kw);
              })
            );
        }

        // select filters
        Object.entries(selects).forEach(([field, val]) => {
            if (val) out = out.filter((row) => String(row?.[field]) === String(val));
        });

        // range filters（含數字轉換）
        Object.entries(ranges).forEach(([field, { min = null, max = null } = {}]) => {
            out = out.filter((row) => {
                const v = Number(row?.[field]);
                if (Number.isNaN(v)) {
                    console.warn('[range] field=%s raw=%o -> NaN (row=%o)', field, raw, row);
                    return false;
                }
                if (min != null && v < Number(min)) return false;
                if (max != null && v > Number(max)) return false;
                return true;
            });
        });

        return out;
    }, [data, columns, JSON.stringify(filters || {})]);

    const sorted = useMemo(() => {
        if (!sort?.key || !sort?.dir) return filtered;
        const dir = sort.dir === "asc" ? 1 : -1;
        const col = columns.find((c) => c.key === sort.key);
        const withCustom = typeof col?.sortFn === "function";

        return [...filtered].sort((a, b) => {
            if (withCustom) return col.sortFn(a, b, sort.dir);
                const av = a?.[sort.key];
                const bv = b?.[sort.key];
                if (av == null && bv == null) return 0;
                if (av == null) return -1 * dir;
                if (bv == null) return 1 * dir;
                if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;
                return String(av).localeCompare(String(bv)) * dir;
            }
    );
    }, [filtered, sort?.key, sort?.dir, columns]);

    return { rows: sorted, total: sorted.length };
}
