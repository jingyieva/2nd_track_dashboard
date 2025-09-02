// 產生 [1, 2, 'ELLIPSIS', 9, 10] 這類的分頁區間
export const getPaginationRange = ({currentPage, totalPages, boundaryCount = 1, siblingCount = 1}) => { 
    // 0) 轉成安全整數並夾住範圍
    const toInt = (v, d = 0) => {
        const n = Number(v);
        return Number.isFinite(n) ? Math.max(0, Math.floor(n)) : d;
    };
    const total = toInt(totalPages);
    if (total <= 0) return [];

    const boundary = toInt(boundaryCount);
    const sibling = toInt(siblingCount);
    const current = Math.min(Math.max(1, toInt(currentPage, 1)), total);

    const range = (s, e) =>
        Array.from({ length: Math.max(0, e - s + 1) }, (_, i) => s + i);

    
    // 1. 全量顯示 
    const totalShownPages = boundary * 2 + sibling * 2 + 3; 
    if (totalPages <= totalShownPages) { 
        return Array.from({ length: totalPages }, (_, i) => i + 1); 
    }
    // 2. 範圍生成器
    const startPages = range(1, boundary);
    const endPages = range(totalPages - boundary + 1, totalPages);
    const siblingStart = Math.max(current - sibling, 1);
    const siblingEnd = Math.min(current + sibling, totalPages);
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