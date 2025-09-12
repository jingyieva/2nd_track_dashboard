import * as mock from '@/actions/services';
// import * as remote from '@/data-sources/remote';

const source = import.meta.env.VITE_DATA_SOURCE || 'mock';

export const getOrders = ({ keyword, platform, revRange, sort, page, pageSize } = {}) => {
    const params = {};

    // 關鍵字
    if (keyword && keyword.trim()) params.q = keyword.trim();

    // 平台
    if (platform) params.platform = platform;

    // 區間 (只在不同於 domain 時才帶)
    if (revRange?.[0] != null) {
        params.revMin = revRange[0];
    }
    if (revRange?.[1] != null) {
        params.revMax = revRange[1];
    }

    // 排序
    if (sort?.key) {
        params.sortBy = sort.key;
        if (sort.dir) params.order = sort.dir;
    }

    // 分頁（伺服器端分頁才用到）
    if (page && pageSize) {
        params.page = page;
        params.pageSize = pageSize;
    }

    const result = source === 'mock' ? mock.getOrders(params) : remote.getOrders(params);
    return result;
}


export const getKpis = (params = {}) =>
  source === 'mock' ? mock.getKpis(params) : remote.getKpis(params);

export const getTrendStats = (params = {}) =>
  source === 'mock' ? mock.getTrendStats(params) : remote.getTrendStats(params);

export const getPlatformStats = (params = {}) =>
  source === 'mock' ? mock.getPlatformStats(params) : remote.getPlatformStats(params);

export const getCategoryStats = (params = {}) =>
  source === 'mock' ? mock.getCategoryStats(params) : remote.getCategoryStats(params);

/**
 * 取得銷售額 vs 淨收入的散點資料（訂單層級）
 * params: { from?:number, to?:number, platform?:'shopee'|'ruten'|'other'|'' }
 */
export const getSalesRevenueScatter = (params = {}) => {
  const src = source === 'mock' ? mock : remote;
  return src.getSalesRevenueScatter(params);
};