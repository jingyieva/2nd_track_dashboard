// src/hooks/useRemoteTableData.js
import { useEffect, useMemo, useState } from "react";
import { useTableData } from "@/hooks/useTableData";

/**
 * @param {Object} opts
 * @param {(params:Object)=>Promise<Array|{items:any[], total?:number}>} opts.fetcher  // 例如 getOrders
 * @param {Array}  opts.columns
 * @param {Object} opts.filters
 * @param {Object} opts.sort
 * @param {boolean} [opts.serverMode=false] // true: 將 filters/sort 丟給伺服器
 * @param {Array}   [opts.deps=[]]          // 何時重新打 API（伺服器端時很有用）
 */
export function useTableDataSource({
    fetcher,
    params = {}, 
    columns,
    filters,
    sort,
    serverMode = false,
    deps = [],
}) {
    const [raw, setRaw] = useState([]);
    const [totalRemote, setTotalRemote] = useState(null);
    const [revenueDomain, setRevenueDomain] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const query = useMemo(() => (serverMode ? params : {}), [serverMode, params]);

    useEffect(() => {
        let cancel = false;
        async function load() {
            setLoading(true);
            setError(null);

            try {
                const res = await fetcher(query);
                const items = Array.isArray(res) ? res : (res?.datas ?? []);
                if (!cancel) {
                    setRaw(items);
                    setTotalRemote(Array.isArray(res) ? null : (res?.total ?? null));
                    setRevenueDomain(res.revenueDomain);
                }
            } catch (e) {
                if (!cancel) setError(e?.message || "載入資料失敗");
            } finally {
                if (!cancel) setLoading(false);
            }
        }

        load();
        return () => { cancel = true; };
        // 注意：本地模式只在掛載時載入一次；伺服器模式依 deps 變更重取
    }, serverMode ? [fetcher, JSON.stringify(query), ...deps] : [fetcher]);

    // 本地模式：把 raw 套用 useTableData
    const localProcessed = useTableData({
        data: raw,
        columns,
        filters,
        sort,
    });

    return {
        // 如果是伺服器模式：理想上直接返回伺服器已處理的 rows/total
        // 這裡先統一回傳 localProcessed
        rows: localProcessed.rows,
        total: localProcessed.total,
        revenueDomain,
        isLoading,
        error,
        refetch: () => {
            // 只要改變 deps（例如加一個 timestamp）就會重取；
            // 或者另外寫 load() 再抽出來都可以。
        },
    };
}
