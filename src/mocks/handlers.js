import { http, HttpResponse } from 'msw';
import { db } from './seed';

function inRange(o, from, to) {
    const ts = Number(o.order_date);
    if (from && ts < from) return false;
    if (to && ts > to) return false;
    return true;
}
function num(n, d = 0) { return Number(n ?? d); }

// 穩定 pseudo 類別映射（依 order_id 最後一位）
const CATEGORIES = ['電器', '裝飾品', '扭蛋', '服飾', '家用小物', '其他'];

function catByOrderId(id) {
    const last = String(id).slice(-1);
    const idx = Number.isFinite(+last) ? (+last % CATEGORIES.length) : 0;
    return CATEGORIES[idx];
}

export const handlers = [
    http.get('/api/orders', ({ request }) => {
        const url = new URL(request.url);
        const from = Number(url.searchParams.get('from') || 0);
        const to = Number(url.searchParams.get('to') || Date.now());
        const platform = url.searchParams.get('platform') || null;
        const revMin = Number(url.searchParams.get('revMin') || undefined);
        const revMax = Number(url.searchParams.get('revMax') || undefined);
        const sortBy = url.searchParams.get('sortBy') || 'order_date';
        const order = url.searchParams.get('order') || 'desc';

        let items = db.orders;

        // 日期
        if (from || to) {
            items = db.orders.filter(o => o.order_date >= from && o.order_date <= to);
        }

        // 平台
        if (platform) {
            items = items.filter(o => o.platform === platform);
        }

        // 淨收入區間
        if (!Number.isNaN(revMin)) {
            items = items.filter(o => o.revenue >= revMin);
        }
        if (!Number.isNaN(revMax)) {
            items = items.filter(o => o.revenue <= revMax);
        }

        // 排序
        items.sort((a, b) => order === 'asc' ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy]);
        // 計算淨收入範圍（含 5% padding）
        let min = Infinity, max = -Infinity;
        for (const r of items) {
            const n = Number(r.revenue);
            if (!Number.isNaN(n)) { if (n < min) min = n; if (n > max) max = n; }
        }
        const pad = Math.round((max - min) * 0.05);

        return HttpResponse.json({
            datas: items,
            total: items.length,
            revenueDomain: { min: Math.floor(min - pad), max: Math.ceil(max + pad) },
            meta: {
                platformsAll: ["shopee", "carousell", "other"],
                platformsAvailable: Array.from(new Set(items.map(x => x.platform))),
                datasRange: {   
                    start: from,
                    end: to,
                }
            }
        });
    }),

    // ============ KPI（以 from/to + platform 篩）============
    http.get('/api/kpis', ({ request }) => {
        const url = new URL(request.url);
        const from = Number(url.searchParams.get('from') || 0);
        const to = Number(url.searchParams.get('to') || Date.now());
        const platform = url.searchParams.get('platform') || '';

        let items = db.orders.filter(o => inRange(o, from, to));
        if (platform && platform !== 'all') {
            items = items.filter(o => o.platform === platform);
        }

        const monthAmount = items.reduce((s, o) => s + num(o.sales), 0);
        const monthOrders = items.length;
        const grossRevenue = items.reduce((s, o) => s + num(o.revenue), 0);

        return HttpResponse.json({ monthAmount, monthOrders, grossRevenue });
    }),

    // ============ 趨勢（日序列）============
    http.get('/api/stats/trend', ({ request }) => {
        const url = new URL(request.url);
        const from = Number(url.searchParams.get('from') || 0);
        const to = Number(url.searchParams.get('to') || Date.now());
        const platform = url.searchParams.get('platform') || '';

        let items = db.orders.filter(o => inRange(o, from, to));

        if (platform && platform !== 'all') {
            items = items.filter(o => o.platform === platform);
        }

        // group by YYYY-MM-DD
        const byDay = new Map();
        for (const o of items) {
            const d = new Date(Number(o.order_date));
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            const cur = byDay.get(key) || { date: key, totalSales: 0, orders: 0, revenue: 0 };
            cur.totalSales += num(o.sales);
            cur.revenue += num(o.revenue);
            cur.orders += 1;
            byDay.set(key, cur);
        }
        const datas = Array.from(byDay.values()).sort((a, b) => a.date.localeCompare(b.date));
        return HttpResponse.json({ datas });
    }),

    // ============ 平台彙總 ============
    http.get('/api/stats/platforms', ({ request }) => {
        const url = new URL(request.url);
        const from = Number(url.searchParams.get('from') || 0);
        const to = Number(url.searchParams.get('to') || Date.now());

        const items = db.orders.filter(o => inRange(o, from, to));
        const agg = new Map();
        for (const o of items) {
            const key = o.platform || 'other';
            const cur = agg.get(key) || { platform: key, totalSales: 0, orders: 0, revenue: 0 };
            cur.totalSales += num(o.sales);
            cur.revenue += num(o.revenue);
            cur.orders += 1;
            agg.set(key, cur);
        }
        const datas = Array.from(agg.values()).sort((a, b) => b.totalSales - a.totalSales);
        return HttpResponse.json({ datas });
    }),

    // ============ 類別占比（穩定 mock，從 order_id 推得） ============
    http.get('/api/stats/categories', ({ request }) => {
        const url = new URL(request.url);
        const from = Number(url.searchParams.get('from') || 0);
        const to = Number(url.searchParams.get('to') || Date.now());

        const items = db.orders.filter(o => inRange(o, from, to));
        const agg = new Map();
        for (const o of items) {
            const cat = catByOrderId(o.order_id);
            const cur = agg.get(cat) || { type: cat, totalSales: 0, orders: 0 };
            cur.totalSales += num(o.sales);
            cur.orders += 1;
            agg.set(cat, cur);
        }
        const datas = Array.from(agg.values()).sort((a, b) => b.totalSales - a.totalSales);
        return HttpResponse.json({ datas });
    }),

    http.get('/api/stats/scatter', ({ request }) => {
        const url = new URL(request.url);
        const from = Number(url.searchParams.get('from') || 0);
        const to = Number(url.searchParams.get('to') || Date.now());
        const platform = url.searchParams.get('platform') || '';

        // 1) 先依時間篩選（與 /api/orders 同步使用 order_date timestamp）
        let items = db.orders.filter(o => o.order_date >= from && o.order_date <= to);

        // 2) 平台（若有值）
        if (platform && platform !== 'all') items = items.filter(o => o.platform === platform);

        // 3) 回傳訂單層級點位（也可 later 聚合成 product 層級）
        const points = items.map(o => ({
            id: o.order_id,
            order_date: o.order_date,
            sales: Number(o.sales) || 0,
            revenue: Number(o.revenue) || 0,
            platform: o.platform, // 'shopee' | 'ruten' | 'other'
        }));

        return HttpResponse.json({
            datas: points,
            total: points.length,
        });
    }),
];
