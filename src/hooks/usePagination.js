// src/hooks/usePagination.js
import { useState, useMemo, useEffect } from "react";

export function usePagination({ 
    datas, totalCount, defaultPageSize = 10, boundaryCount = 1, siblingCount = 1, 
    scrollTargetRef = null,
    scrollOffset = 0, // 預設不加 offset
 }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(defaultPageSize);
    const totalPages = Math.ceil(totalCount / pageSize);

    // 無效頁面防呆判斷
    useEffect(() => {
        if (totalPages === 0) {
            setCurrentPage(1);
        } else if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);

    const getPaginationRange = (currentPage, totalPages, boundaryCount = 1, siblingCount = 1) => { 
        // 1. 全量顯示 
        const totalShownPages = boundaryCount * 2 + siblingCount * 2 + 3; 
        if (totalPages <= totalShownPages) { 
            return Array.from({ length: totalPages }, (_, i) => i + 1); 
        }
        // 2. 範圍生成器
        const range = (start, end) => Array.from({ length: end - start + 1 }, (_, i) => start + i);
        const startPages = range(1, boundaryCount);
        const endPages = range(totalPages - boundaryCount + 1, totalPages);
        const siblingStart = Math.max(currentPage - siblingCount, 1);
        const siblingEnd = Math.min(currentPage + siblingCount, totalPages);
        const siblings = range(siblingStart, siblingEnd);

        // 3. 合併 + 去重 + 排序
        let pages = [...startPages, ...siblings, ...endPages]
            .filter((page, index, self) => page >= 1 && page <= totalPages && self.indexOf(page) === index)
            .sort((a, b) => a - b);

        // 4. 插入 ELLIPSIS
        let pagination = [];
        for (let i = 0; i < pages.length; i++) {
            if (i === 0) {
                pagination.push(pages[i]);
            } else {
                if (pages[i] - pages[i - 1] === 1) {
                    pagination.push(pages[i]);
                } else {
                    pagination.push('ELLIPSIS');
                    pagination.push(pages[i]);
                }
            }
        }

        return pagination;
    };

    const paginationRange = useMemo(() =>
        getPaginationRange(currentPage, totalPages, boundaryCount, siblingCount),
    [currentPage, totalPages, boundaryCount, siblingCount]);

    const scrollToTableTop = () => {
        if (scrollTargetRef?.current) {
            const rect = scrollTargetRef.current.getBoundingClientRect();
            const absoluteTop = window.scrollY + rect.top;
            window.scrollTo({
            top: absoluteTop - scrollOffset,
            behavior: "smooth",
            });
        }
    };

    const currentData = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return datas.slice(start, start + pageSize);
    }, [currentPage, datas, pageSize]);

    const changePageSize = (size) => {
        setPageSize(size);
        setCurrentPage(1);
        scrollToTableTop();
    };

    const switchPage = (page) => {
        const safePage = Math.min(Math.max(page, 1), totalPages || 1);
        setCurrentPage(safePage);
        scrollToTableTop();
    };

    return {
        changePageSize,
        switchPage,
        currentPage,
        currentData,
        totalPages,
        paginationRange,
        pageSize
    };
}
