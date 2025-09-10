// 假資料產生器（固定種子，避免每次刷新都不同）

let x = 123456789, y = 362436069, z = 521288629, w = 88675123;
const rand = () => {
    const t = x ^ (x << 11);
    x = y; y = z; z = w;
    return (w = (w ^ (w >>> 19)) ^ (t ^ (t >>> 8))) >>> 0;
};
const rng = () => rand() / 0xffffffff;

const platforms = ['shopee', 'carousell', 'other'];
const shippingPayers = ['buyer', 'seller'];

const now = new Date();

export const db = {
    orders: Array.from({ length: 120 }).map((_, i) => {
        // 過去 90 天內的隨機日期
        const daysAgo = Math.floor(rng() * 90);
        const ts = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() - daysAgo,
            Math.floor(rng() * 24),
            Math.floor(rng() * 60)
        ).getTime();

        const sales = Math.round(rng() * 1500 + 500); // 總金額
        const commission_fee = Math.round(sales * (0.03 + rng() * 0.07)); // 3–10%
        const shipping_fee = Math.round(rng() * 100); // 運費
        const shipping_fee_payer = shippingPayers[Math.floor(rng() * shippingPayers.length)];
        const cost = Math.round(rng() * 800 + 50); // 成本
        const revenue = sales - commission_fee - shipping_fee - cost;

        return {
            order_id: `ORD-${10001 + i}`,
            order_date: ts, // timestamp
            platform: platforms[Math.floor(rng() * platforms.length)],
            commission_fee,
            shipping_fee_payer,
            shipping_fee,
            cost,
            sales,
            revenue,
        };
    }),
};
