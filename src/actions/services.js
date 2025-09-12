function qs(params = {}) {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return;
    sp.set(k, String(v));
  });
  const s = sp.toString();
  return s ? `?${s}` : '';
}

async function getJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function getOrders(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`/api/orders?${qs}`);
  return res.json();
}

// ============ KPIs（本月 / 視窗） ============
export async function getKpis(params = {}) {
  return getJSON(`/api/kpis${qs(params)}`);
}

// ============ 趨勢（日序列） ============
export async function getTrendStats(params = {}) {
  return getJSON(`/api/stats/trend${qs(params)}`);
}

// ============ 平台彙總 ============
export async function getPlatformStats(params = {}) {
  return getJSON(`/api/stats/platforms${qs(params)}`);
}

// ============ 類別占比（mock 映射） ============
export async function getCategoryStats(params = {}) {
  return getJSON(`/api/stats/categories${qs(params)}`);
}

export const getSalesRevenueScatter = async (params = {}) => {
 return getJSON(`/api/stats/scatter${qs(params)}`);
};