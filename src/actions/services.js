export async function getOrders(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`/api/orders?${qs}`);
  return res.json();
}
export async function getKpis(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`/api/kpis?${qs}`);
  return res.json();
}
