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

const productNames = [
    '運動短褲', '來貘杯緣子', '戽斗星球扭蛋', 'Google TV Streamer', '皮卡丘存錢統', '迷你麻將', '免沖洗護髮膠囊',
    'Airpod pro', '阿楞公仔', '貓頭鷹公仔', '熊貓公仔', 'Snoopy鑰匙圈', '夜光精靈公仔', '保溫瓶', '羅技無線滑鼠',
];

const productTypes = ['electronics', 'accessories', 'toys', 'clothes', 'books'];

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
    products: Array.from(productNames).map((p, i) => ({
        product_id: `P-${1001 + i}`,
        name: `p`,
        views: Math.round(rng() * 100),
        type: productTypes[Math.floor(rng() * productTypes.length)]
    })),
    map_order_to_products: [], // 之後可補
};
