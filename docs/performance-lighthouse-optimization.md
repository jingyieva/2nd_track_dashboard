# Lighthouse 優化筆記（從 ~91 → 97 的完整過程）

## 目錄

- [背景與目標](#%E8%83%8C%E6%99%AF%E8%88%87%E7%9B%AE%E6%A8%99)
- [初始狀態（~91 分）](#%E5%88%9D%E5%A7%8B%E7%8B%80%E6%85%8B91-%E5%88%86)
- [最終狀態（97 分）](#%E6%9C%80%E7%B5%82%E7%8B%80%E6%85%8B97-%E5%88%86)
- [逐檔對照與程式碼差異](#%E9%80%90%E6%AA%94%E5%B0%8D%E7%85%A7%E8%88%87%E7%A8%8B%E5%BC%8F%E7%A2%BC%E5%B7%AE%E7%95%B0)
    - [Dashboard：圖表改為可見＋Idle 才載入](#dashboard%E5%9C%96%E8%A1%A8%E6%94%B9%E7%82%BA%E5%8F%AF%E8%A6%8Bidle-%E6%89%8D%E8%BC%89%E5%85%A5)    
    - [Navbar：行動選單互動才載入 Radix](#navbar%E8%A1%8C%E5%8B%95%E9%81%B8%E5%96%AE%E4%BA%92%E5%8B%95%E6%89%8D%E8%BC%89%E5%85%A5-radix)     
    - [ThemeToggle：改用零依賴 SVG](#themetoggle%E6%94%B9%E7%94%A8%E9%9B%B6%E4%BE%9D%E8%B3%B4-svg)    
    - [Vite 分包與預抓設定](#vite-%E5%88%86%E5%8C%85%E8%88%87%E9%A0%90%E6%8A%93%E8%A8%AD%E5%AE%9A)    
    - [PWA 設定（極簡，避免干擾首屏）](#pwa-%E8%A8%AD%E5%AE%9A%E6%A5%B5%E7%B0%A1%E9%81%BF%E5%85%8D%E5%B9%B2%E6%93%BE%E9%A6%96%E5%B1%8F)    
    - [LCP 微調（標題與 Logo）](#lcp-%E5%BE%AE%E8%AA%BF%E6%A8%99%E9%A1%8C%E8%88%87-logo)    
- [量測方式與驗證步驟](#%E9%87%8F%E6%B8%AC%E6%96%B9%E5%BC%8F%E8%88%87%E9%A9%97%E8%AD%89%E6%AD%A5%E9%A9%9F)
- [踩雷與避坑](#%E8%B8%A9%E9%9B%B7%E8%88%87%E9%81%BF%E5%9D%91)
- [變更摘要（可當 PR 描述）](#%E8%AE%8A%E6%9B%B4%E6%91%98%E8%A6%81%E5%8F%AF%E7%95%B6-pr-%E6%8F%8F%E8%BF%B0)
- [附錄：BelowFold 元件（選用）](#%E9%99%84%E9%8C%84belowfold-%E5%85%83%E4%BB%B6%E9%81%B8%E7%94%A8)
    

---

## 背景與目標

- **目標**：儀表板在行動裝置 Lighthouse（Mobile）達到穩定的高分，並確保實際體感（LCP/FCP）改善。
- **策略**：**首屏極簡** + **互動/可見才載** + **避免工具預抓** + **針對 LCP 元素微調**。
    

---

## 初始狀態（~91 分）

### 觀察到的症狀

- 首屏就出現大型 JS：`recharts-*.js`、Radix（Dropdown）等提早載入。
- LCP 為標題 `<h1>`，但 **Render Delay 偏大**（文字排版與鄰近元素影響）。
- Skeleton 在行動首屏高度過高（420px），容易搶 LCP。
- PWA/Workbox 在安裝階段預抓 JS，Lighthouse 出現「Reduce unused JavaScript」。
- 在 dev 模式量測（HMR/未壓縮）導致 FCP/LCP 偏慢。

### 代表性程式（片段）

```jsx
// Dashboard.jsx（❌ lazy 但元件已進樹 → 仍會 import）
const ChartsFold = lazy(() => import('@/pages/Dashboard/ChartsFold'));

<section>
  <Suspense fallback={<ChartSkeleton className="h-[420px]" />}> {/* ❌ 行動骨架過高 */}
    <ChartsFold />
  </Suspense>
</section>

// Navbar.jsx（❌ 頂層引入 Radix → 首包含 Radix）
import { DropdownMenu, ... } from '@/components/ui/dropdown-menu';

// index.html（❌ 首屏註冊 SW）
<script type="module" src="/registerSW.js"></script>
```

---

## 最終狀態（97 分）

### 關鍵改善

- **Recharts / Radix** 完全移出首屏：**可見/Idle 才載** 或 **點擊才載**。
- **LCP（標題）更快繪製**：行動端移除 `text-balance`、Logo 固定尺寸/延後載入、圖表骨架變矮並下推。
- **Vite 不預抓動態匯入**：關掉 modulePreload，所有懶載 `import()` 加 `/* @vite-ignore */。
- **PWA 設定極簡**：不預快取 JS，不干擾首屏；真的要用 Workbox 再逐步加。
    

---

## 逐檔對照與程式碼差異

### Dashboard：圖表改為可見＋Idle 才載入

**Before**
```jsx
const ChartsFold = lazy(() => import('@/pages/Dashboard/ChartsFold'));
<Suspense fallback={<ChartSkeleton className="h-[420px]" />}>
  <ChartsFold />
</Suspense>
```

**After（核心差異）**
```jsx
// src/pages/Dashboard/index.jsx
import { useEffect, useState } from "react";
import ChartSkeleton from "@/components/charts/ChartSkeleton";
import KPICard from "@/pages/Dashboard/KPICard";
import { useVisible } from "@/hooks/useVisible";

export default function Dashboard (){
  const { ref: sentinelRef, visible } = useVisible("0px"); // ✅ 視窗內才觸發
  const [ChartsFold, setChartsFold] = useState(null);

  useEffect(() => {
    if (!visible || ChartsFold) return;
    const run = () => {
      import(/* @vite-ignore */ '@/pages/Dashboard/ChartsFold') // ✅ 禁止 Vite 預抓
        .then(m => setChartsFold(() => m.default));
    };
    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(run);
      return () => cancelIdleCallback(id);
    } else {
      const t = setTimeout(run, 400);
      return () => clearTimeout(t);
    }
  }, [visible, ChartsFold]);

  return (
    <div className="space-y-6">
      {/* Above-the-fold：KPI 區 */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <KPICard />
      </section>

      {/* 哨兵：確保初始不在首屏 */}
      <div ref={sentinelRef} className="h-px w-full" aria-hidden />

      {/* 圖表區（懶載） */}
      <section className="below-fold">
        {ChartsFold
          ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><ChartsFold/></div>
          : <ChartSkeleton height="h-48 md:h-[420px]" /> /* ✅ 行動骨架降低 */}
      </section>
    </div>
  );
}
```


> 為什麼有效：避免 `lazy()` 在初始 render 就 import；使用 `useEffect + import()` 並加 `/* @vite-ignore */`。  
> 行動端骨架降低＋區段下推，讓 `<h1>` 更容易成為並完成 LCP 繪製。

---

### Navbar：行動選單互動才載入 Radix

**Before**
```jsx
// Navbar.jsx（❌ 頂層 import Radix）
import { DropdownMenu, DropdownMenuContent, ... } from '@/components/ui/dropdown-menu';

<div className="block lg:hidden">
  <DropdownMenu>...</DropdownMenu>
</div>

```
**After**

```jsx
// Navbar.jsx
import NavbarMobileMenuLoader from "@/components/NavbarMobileMenuLoader";
import { Button } from '@/components/ui/button';
import ThemeToggle from "@/components/ThemeToggle";
// ...（略）

<div className="block lg:hidden">
  <NavbarMobileMenuLoader open={mobileOpen} onOpenChange={setMobileOpen} />
</div>

```

> 為什麼有效：Radix（Dropdown）不再進首包，只有點擊「More」才下載。

---

### ThemeToggle：改用零依賴 SVG

**Before**

- 可能用到 `lucide-react` 或 Radix。
    

**After（示意）**

```jsx
// src/components/ThemeToggleLite.jsx（純 SVG，不帶第三方）
export default function ThemeToggleLite(){
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);
  return (
    <button type="button" onClick={() => setDark(v => !v)} aria-label="Toggle theme"
      className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
      {/* 省略 SVG */}
      <span className="hidden sm:inline">{dark ? "Light" : "Dark"}</span>
    </button>
  );
}

```

> 為什麼有效：避免在首屏載入 `icons-*.js` 或 Radix，相依更單純。

---

### Vite Bundle 與預抓設定

```jsx
// vite.config.js（核心）
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    modulePreload: false, // ✅ 禁止對動態匯入自動預抓
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('recharts')) return 'recharts';
          if (id.includes('lucide-react')) return 'icons';
          if (id.includes('/react/') || id.includes('react-dom')) return 'react-vendor';
          return 'vendor';
        },
      },
    },
  },
})

```

> 為什麼有效：避免把整個 `@radix-ui/*` 硬打成一包（會讓首屏載到不必要的 Radix）。  
> `modulePreload: false` 搭配 `/* @vite-ignore */` 避免 Vite 替動態匯入插入預抓。

---

### PWA 設定（極簡，避免干擾首屏）

```jsx
// vite.config.js（簡版，不加入 workbox 設定）
VitePWA({
  registerType: 'autoUpdate',
  includeAssets: ['logo/*', 'favicon.ico'],
  manifest: {
    name: '二手交易分析儀表板',
    short_name: 'Dashboard',
    theme_color: '#0f172a',
    icons: [
      { src: '/pwa-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/pwa-512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
})

```

> 備註：之後若要加 Workbox，建議只預快取「殼檔」（`html/css/ico/svg/png/webmanifest`），**不要預快取 `.js`**，並在變更後 **Unregister + Clear site data** 再測。

---

### LCP 微調（標題與 Logo）

```diff
- <p className="text-xl md:text-3xl lg:text-5xl font-extrabold text-balance ...">2nd Track Dashboard</p>
+ <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight break-words md:[text-wrap:balance]">
+   2nd Track Dashboard
+ </h1>

- <img src="/logo/2nd-track-mark.svg" className="h-10 w-10" fetchPriority="high" />
+ <img src="/logo/2nd-track-mark.svg" alt="2nd Track"
+      width="40" height="40" loading="lazy" fetchpriority="low" decoding="async"
+      className="h-10 w-10" />

```

> 為什麼有效：移除行動端 `text-balance` 減少昂貴排版；圖片固定尺寸＋降優先權，避免 reflow 與爭搶資源。

---

## 量測方式與驗證步驟

1. **Production 模式量測**：`pnpm build && pnpm preview`（不要用 dev/HMR）。 
2. **Network（首屏）** 檢查：初載不應出現 `ChartsFold-*.js` / `recharts-*.js` / 重的 `radix-*.js`。
3. **Lighthouse（Mobile）**：連跑 2–3 次取中位，觀察 **LCP(ms)** 與「Reduce unused JS」。 
4. **如調整 PWA**：DevTools → Application → **Unregister SW** + **Clear site data**，再測。
    
---

## 踩雷與避坑

- `lazy()` 但元件已進樹 → 仍會 import；請改 **可見/互動後 `import()`**。
    
- `modulePreload` 會對動態匯入預抓 → 設 `build.modulePreload = false` + 在動態匯入加 `/* @vite-ignore */`。
    
- 哨兵不能用 `sr-only/hidden`（不參與排版），需用有尺寸的元素（如 `h-px w-full`）。
    
- 不要把整個 `@radix-ui/*` 綁一包；`Button` 只需 `react-slot`，其他 Radix 留在懶載路徑。
    
- PWA/Workbox 設過度積極會讓 Lighthouse 波動；先用**極簡 PWA**最穩。
    
- `injectRegister: null` 若配「同步 import 註冊碼」→ 會更早執行、擴大入口 chunk；要改 **`window.load` 後動態 import**。
    

---

## 變更摘要

- **perf(dashboard):** 圖表改為 IntersectionObserver + idle 懶載；降低行動骨架高度，避免 LCP 受影響。
- **perf(nav):** 行動選單改為互動才載入 Radix；桌面導覽用輕量 Button。
- **perf(theme):** ThemeToggle 改純 SVG，移除首屏對圖示/Radix 依賴。
- **build(vite):** 關閉 modulePreload；分包為 `react-vendor`/`recharts`/`icons`/`vendor`；禁止懶載預抓。
- **pwa:** 使用極簡 VitePWA，暫不加入 Workbox 預快取 JS。
- **ux/lcp:** 標題（行動）移除 `text-balance`；logo 固定尺寸、延後載入。
- **result:** Lighthouse（Mobile）由 ~91 提升至 **97**；首屏 Network 更乾淨，LCP/FCP 下降。

---

## 附錄：BelowFold 元件（選用）

> 若希望語意更清晰、便於重用，可抽成組件。

```jsx
// src/components/BelowFold.jsx
import { useEffect, useState } from 'react'
import { useVisible } from '@/hooks/useVisible'

export default function BelowFold({
  offset = '0px', idle = true, once = true,
  fallback = null, children,
}) {
  const { ref, visible, disconnect } = useVisible(offset, { once })
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!visible || show) return
    const run = () => setShow(true)
    if ('requestIdleCallback' in window && idle) {
      const id = requestIdleCallback(run)
      return () => cancelIdleCallback(id)
    } else {
      const t = setTimeout(run, 0)
      return () => clearTimeout(t)
    }
  }, [visible, show, idle])

  useEffect(() => { if (once && show && disconnect) disconnect() }, [once, show, disconnect])

  return (
    <section>
      {/* 需參與排版，才能觸發 IO */}
      <div ref={ref} className="h-px w-full" aria-hidden />
      {show ? children : fallback}
    </section>
  )
}

```

使用：

```jsx
<BelowFold offset="0px" idle once fallback={<ChartSkeleton height="h-48 md:h-[420px]" />}>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <ChartsFoldLoader /> {/* 內部用 import(/* @vite-ignore */) 動態載入模組 */}
  </div>
</BelowFold>
```