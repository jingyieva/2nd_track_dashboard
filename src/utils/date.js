/** 根據預設區間，回傳對應的 from/to 時間戳 */
export function resolveRangeByPreset(preset) {
  if (!preset || preset === 'all') return { from: undefined, to: undefined };
  const days = preset === '7d' ? 7 : preset === '30d' ? 30 : 90;
  const to = Date.now();
  const from = to - days * 86_400_000;
  return { from, to };
}

/** KPI 的「本月」輔助（取當月第一天 ~ now） */
export function resolveCurrentMonth() {
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  return { from, to: Date.now() };
}