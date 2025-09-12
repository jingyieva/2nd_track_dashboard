## Context
此專案為個人 MVP（2nd Track Dashboard），需要全域篩選器（range / platform / q）在 Dashboard + Orders 間同步更新；目前資料以 MSW 模擬，前端以 React + hooks 為主。

---
## Options Considered
| 選項                      | 優點                                            | 缺點                                   | 適用情境                 |
| ----------------------- | --------------------------------------------- | ------------------------------------ | -------------------- |
| Zustand                 | API 極簡、零樣板；以 hooks 為中心；可逐步擴充 middleware；學習成本低 | 缺少 Redux 生態的大量周邊（devtools/時間旅行/嚴格規範） | 個人/小型專案、快速迭代、狀態關聯簡單  |
| Redux Toolkit (RTK)     | 工程化強、可預測性高；中大型團隊常用；周邊完善（RTK Query、DevTools）   | 樣板與概念較多；心智負擔高；對 MVP/Side project 偏重  | 大型專案、多人協作、需要嚴格流程與中介層 |
| React Context + Reducer | 內建、零依賴；小規模可行                                  | 容易遇到 re-render 擴散；跨頁/跨模組擴張後維護成本上升    | 單一頁或極小共享狀態           |

---

## Decision
採用 Zustand 作為全域篩選狀態管理（range / platform / q）。
KPI/圖表/表格共用同一 state；「結構化條件」發給後端（MSW handlers），q 保留前端模糊搜尋以確保表格與 KPI 對齊。

---

## Rationale
- 需求輕量：僅同步篩選條件，不涉及複雜跨模組資料流。
- 開發效率：Zustand 幾行就能建 store，符合 MVP 快速迭代。
- 程式簡潔：少樣板、易閱讀，利於作品集呈現。
- 可演進：若未來擴張到多人/大型專案，可無痛遷移至 RTK。

---

## Trade-offs
- 放棄 Redux 的既有生態（時間旅行、嚴格規範、RTK Query），但就當前規模 不需。
- 需自行規範 store 結構與副作用位置（本案已透過 actions / handlers 劃清責任）。

---

## When to Revisit
- 團隊擴編、需求升級為「多 slice/中介層/權限/審計」。
- 需要 SSR、嚴格的變更追蹤、或與後端大量聯動（考慮 RTK + RTK Query）。
- 前端改為真正的後端分頁/聚合且邏輯激增。

---

## Implementation Notes
### Store（最小雛型）
```js
// src/stores/filters.js
// 
// Range = '7d' | '30d' | '90d' | 'all';
// Platform = 'all' | 'shopee' | 'ruten' | 'other';
// State = {
//   range: Range;
//   platform: Platform;
//   q: string;
//   setRange: (r: Range) => void;
//   setPlatform: (p: Platform) => void;
//   setQ: (q: string) => void;
//   reset: () => void;
//  };
//

export const useFiltersStore = create((set) => ({
  range: '30d',
  platform: 'all',
  q: '',
  setRange: (range) => set({ range }),
  setPlatform: (platform) => set({ platform }),
  setQ: (q) => set({ q }),
  reset: () => set({ range: '30d', platform: 'all', q: '' }),
}));

```
### 組裝參數（共用於 Dashboard / Orders）
```js
// 由全域 store 轉成後端參數；q 保留前端模糊搜尋
const { range, platform, q } = useFiltersStore.getState();
const spanDays = { '7d': 7, '30d': 30, '90d': 90, 'all': null }[range];
const dateFrom = spanDays ? Date.now() - spanDays * 864e5 : undefined;

const params = {
  platform: platform === 'all' ? undefined : platform,
  dateFrom,      // handlers 若支援就用它過濾 order_date >= dateFrom
  // q 不傳後端：前端表格與 KPI 用最終 rows 做模糊搜尋/聚合
};

```