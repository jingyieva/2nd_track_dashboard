# 模組拆分問題

## 🔎 狀況

- 在調整 Vite 的 `manualChunks` 設定後，production build 部署到 Vercel 時，畫面出現 **白屏 + console 錯誤**。
- 錯誤訊息顯示 `unstable_now` 等 React Scheduler 相關變數找不到，導致應用無法運行。
- 部分情況下需要清除 Service Worker 才能恢復，否則會持續報錯。
    

---

## ⚠️ 原因

1. **React / React-DOM / Scheduler 拆分不一致**
    - `manualChunks` 將 React 與 Scheduler 分散到不同 bundle，導致 runtime 載入時版本對應不一致。
    - Scheduler 是 React 內部相依，版本差異或 bundle 分離會造成 API 缺失。
### 延伸問題
1. **MSW（Mock Service Worker）快取干擾**. (延伸問題)
    - 舊的 service worker 腳本沒有正確更新，導致載入舊版資源與新版 bundle 混用。
2. **依賴包過大問題**. (延伸問題)
    - `vendor-*.js` 超過 **500kb**，顯示初始模組拆分策略不佳。
        

---

## 🛠️ 過程

1. **初步嘗試**
	- 認為是 `scheduler` 版本不一致，嘗試在 `package.json` 指定 `"scheduler": "0.23.0"` 並透過 overrides 鎖定，但 pnpm 解析後仍安裝 `0.26.0`。
	- 確認 lockfile 舊版本也已使用 `0.26.0`，排除「版本回退」解法。  
2. **比對狀態**
	- 驗證發現：同樣版本的程式碼，如果 **移除 manualChunks**，就能正常運行。
	- 進一步證實是 **錯誤的 chunk 切分策略**，導致 React/Scheduler 沒有正確綁定。
3. **調整策略**
	- 將 `manualChunks` 規則修改為：
		- **固定群組**：`react`、`react-dom`、`react-router`、`lucide-react` 等各自獨立。		
		- **避免細碎切分**：不要額外把 `scheduler` 或 React 內部套件單獨拉出來。		
	- 清除瀏覽器 Service Worker 舊快取，避免載入舊資源。	

---

## ✅ 解決方式

1. **修正 `vite.config.js`**
    - 在 `manualChunks` 中 **統一 React 相關套件**（`react`、`react-dom`、`scheduler`）歸在同一個 chunk，避免拆散。
    - 其他大套件如 `recharts`、`lucide-react` 可以獨立拆出，降低 vendor 體積。
```js
rollupOptions: {
	output: {
		manualChunks(id) {
			  if (!id.includes('node_modules')) return;
			  if (id.includes('recharts')) return 'recharts';
			  if (id.includes('lucide-react')) return 'icons';
			  if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler')) {
				return 'react-vendor';
			  }
			  return 'vendor';
		}
	}
}

```
2. **清理 Service Worker 快取**
    - 手動 `unregister()` 舊 service worker，避免舊版與新版 bundle 混合。
3. **指定 React 版本**
    - 將 React 升級至 **19.1.1**，與 `scheduler@0.26.0` 搭配穩定。    
4. **結果**
    - 修正後 `vendor-*.js` 體積壓到 **500kb 以下**。  
    - production 環境運作正常，白屏與 `unstable_now` 錯誤消失。