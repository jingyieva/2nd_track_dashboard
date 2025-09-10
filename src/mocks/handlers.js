import { http, HttpResponse } from 'msw';
import { db } from './seed';

export const handlers = [
    http.get('/api/orders', ({ request }) => {
        const url = new URL(request.url);
        const from = Number(url.searchParams.get('from') || 0);
        const to = Number(url.searchParams.get('to') || Date.now());
        const platform = url.searchParams.get('platform') || null;
        const revMin   = Number(url.searchParams.get('revMin') || undefined) ;
        const revMax   = Number(url.searchParams.get('revMax') || undefined) ;
        const sortBy = url.searchParams.get('sortBy') || 'order_id';
        const order = url.searchParams.get('order') || 'desc';

        let items = db.orders;
        
        // 日期
        if ( from || to ) { 
            items = db.orders.filter(o => o.order_date >= from && o.order_date <= to);
        }
        
        // 平台
        if (platform) { 
            items = items.filter(o => o.platform === platform);
        }
        
        // 淨收入區間
        if ( !Number.isNaN(revMin) ) {
            items = items.filter(o => o.revenue >= revMin);
        }
        if ( !Number.isNaN(revMax) ) {
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
            revenueDomain:  { min: Math.floor(min - pad), max: Math.ceil(max + pad) }
        });
    }),

    http.get('/api/kpis', ({ request }) => {
        const url = new URL(request.url);
        const from = Number(url.searchParams.get('from') || 0);
        const to = Number(url.searchParams.get('to') || Date.now());
        const items = db.orders.filter(o => o.ts >= from && o.ts <= to);

        const monthAmount = items.reduce((s, o) => s + o.amount, 0);
        const monthOrders = items.length;
        const grossRevenue = items.reduce((s, o) => s + o.netIncome, 0);

        return HttpResponse.json({ monthAmount, monthOrders, grossRevenue });
    }),
];
