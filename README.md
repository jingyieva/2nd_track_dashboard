# 二手交易分析儀表板

一個以 **React + Vite + TailwindCSS + shadcn/ui + Recharts** 建立的前端儀表板專案，  
此專案目標為快速驗證二手交易資料的可視化方式，並支援 暗/亮主題切換。

🚀 [Demo 網址](https://2nd-track-dashboard.vercel.app)

---

## ✨功能特色
- **表格管理**：支援分頁、篩選、排序
- **圖表呈現**：使用 Recharts 繪製長條圖、圓餅圖、折線圖
- **主題切換**：暗/亮模式一鍵切換
- **路由設計**：
  - `/orders`：訂單列表
  - `/orders/:id`：訂單詳細頁（開發中）
  - `/products`: 商品列表（開發中）
  - `*`：自訂 404 頁面
- **使用者體驗強化**：提供 Loading / Empty state 畫面

---

## 🛠️技術組合
- **開發環境**：Node.js v22.x、pnpm v10.x
- **UI Library**：React 19
- **開發與建構工具**：Vite
- **樣式**：TailwindCSS、shadcn/ui
- **資料視覺化**：Recharts
- **測試框架**：Jest + React Testing Library
- **自動化流程**：
    - semantic-release（版本號與發版流程）  
    - （規劃中）Lint/Test 自動化、Storybook + Chromatic、Lighthouse CI
- **部署平台**：Vercel

---

## 📂專案結構
```bash
src/  
├─ components/   # 共用元件（Button、Card、表格元件等可重用 UI）
├─ constants/    # 常數定義（顏色、路由路徑、系統設定等）
├─ contexts/     # React Context providers（例如 ThemeProvider、AuthProvider）
├─ hooks/        # 自訂 React hooks（資料處理、邏輯抽離）
├─ layouts/      # 頁面佈局元件（Navbar、Sidebar、Dashboard Layout 等）
├─ libs/         # 外部套件封裝（如 shadcn/ui 元件客製化、第三方函式庫整合）
├─ pages/        # 各路由頁面（/orders、/charts、/orders/:id）
├─ styles/       # 全域樣式與 Tailwind 擴充設定
├─ App.jsx       # 應用路由設定（React Router）
└─ main.jsx      # 專案進入點（ReactDOM render、全域 Provider 掛載）
```
---

## 🚦開發與測試
```bash
# 安裝套件
pnpm install

# 啟動開發 server
pnpm dev

# 建置專案
pnpm build

# 執行測試
pnpm test
```