## [2.0.2](https://github.com/jingyieva/2nd_track_dashboard/compare/v2.0.1...v2.0.2) (2025-09-12)


### Bug Fixes

* **orders:** prevent revenue slider from resetting after release ([5e521cc](https://github.com/jingyieva/2nd_track_dashboard/commit/5e521cc0fcee4e3bb11a2c96c273c6799c5b3bf5))

## [2.0.1](https://github.com/jingyieva/2nd_track_dashboard/compare/v2.0.0...v2.0.1) (2025-09-12)


### Bug Fixes

* **msw:** enable MSW in both dev and production via VITE_ENABLE_MSW flag ([ea79255](https://github.com/jingyieva/2nd_track_dashboard/commit/ea79255fd4d55e761e1b35fd92dee5342972d076))

# [2.0.0](https://github.com/jingyieva/2nd_track_dashboard/compare/v1.8.0...v2.0.0) (2025-09-12)


* feat(dashboard)!: introduce global filters and improve accessibility ([f9d8097](https://github.com/jingyieva/2nd_track_dashboard/commit/f9d80978d3c849c7f80d7b1b97ce653f46331ac4))


### Features

* **orders:** 重構訂單列表資料流與篩選邏輯 ([c137071](https://github.com/jingyieva/2nd_track_dashboard/commit/c13707132e75982645c6626ae00bd7483f1db1b7))


### BREAKING CHANGES

* Dashboard and Orders pages no longer rely on local state for filters.
All filtering logic is now managed via the global Zustand store.
Previous usage of local filter state or props will no longer work and must be migrated
to use the store's API (useFiltersStore).

# [1.8.0](https://github.com/jingyieva/2nd_track_dashboard/compare/v1.7.3...v1.8.0) (2025-09-05)


### Bug Fixes

* **chart:** 修正 StackedBar 在啟用 Y 軸時無法正常顯示長條圖 ([d15cc35](https://github.com/jingyieva/2nd_track_dashboard/commit/d15cc35e2eb21fbcce46789d589cc5a7adf68df2))


### Features

* **storybook:** Add ToggleStacked Story, support the interaction of stacked/unstacked barchart ([3f24378](https://github.com/jingyieva/2nd_track_dashboard/commit/3f24378c7e98d99364e9a79fc48869e430a1c94c))
* **storybook:** 新增 Chart.stories.jsx，展示 Bar/Line/Pie 及狀態 ([e8da918](https://github.com/jingyieva/2nd_track_dashboard/commit/e8da918382695c2ff6d149cacf1e270fb639c2fd))

## [1.7.3](https://github.com/jingyieva/2nd_track_dashboard/compare/v1.7.2...v1.7.3) (2025-09-02)


### Bug Fixes

* **vercel:** redirect /storybook -> /storybook/ to ensure correct asset base ([c6ae9a0](https://github.com/jingyieva/2nd_track_dashboard/commit/c6ae9a0040397c436acf7e580a2321e04ebb1eb8))

## [1.7.2](https://github.com/jingyieva/2nd_track_dashboard/compare/v1.7.1...v1.7.2) (2025-09-02)


### Bug Fixes

* **vercel:** correct rewrite rules for Storybook and SPA routing ([7fe2015](https://github.com/jingyieva/2nd_track_dashboard/commit/7fe20159e31b150086012e182a0df6a243ad1713))

## [1.7.1](https://github.com/jingyieva/2nd_track_dashboard/compare/v1.7.0...v1.7.1) (2025-09-02)


### Bug Fixes

* **deploy:** disable PWA during Storybook build and adjust vercel-build for combined deployment ([6e2a599](https://github.com/jingyieva/2nd_track_dashboard/commit/6e2a59980d0aa6711487d94d9250a3f200736a65))

# [1.7.0](https://github.com/jingyieva/2nd_track_dashboard/compare/v1.6.1...v1.7.0) (2025-09-02)


### Features

* **storybook:** setup Storybook and add stories for Button, Badge, Card, Input, Checkbox, Select, Table, and Pagination ([2b9d7f7](https://github.com/jingyieva/2nd_track_dashboard/commit/2b9d7f71bec3f103307ec75761fed545c0ec2aa0))

## [1.6.1](https://github.com/jingyieva/2nd_track_dashboard/compare/v1.6.0...v1.6.1) (2025-08-29)


### Bug Fixes

* **release:** generate CHANGELOG.md via semantic-release ([ca9cb6c](https://github.com/jingyieva/2nd_track_dashboard/commit/ca9cb6c7be802e4c7910b20d939ccfbd47d0c3aa))

## [1.6.0](https://github.com/jingyieva/2nd_track_dashboard/compare/v1.5.0...v1.6.0) (2025-08-29)

### Features

* **orders-table:** 表格 UX 強化 + a11y + 測試穩定化 ([a76cfa3](https://github.com/jingyieva/2nd_track_dashboard/commit/a76cfa316c58d3a22ff22ef8798d402fc22d5199))

## [1.5.0](https://github.com/jingyieva/2nd_track_dashboard/compare/v1.4.0...v1.5.0) (2025-08-27)

### Features

* **orders:** enhance table with sorting, filtering, sticky header and state handling ([333078d](https://github.com/jingyieva/2nd_track_dashboard/commit/333078dd7036c89bc8bb296a089dee5914fd12d6))

## [1.4.0](https://github.com/jingyieva/2nd_track_dashboard/compare/v1.3.0...v1.4.0) (2025-08-25)

### Features

* **branding:** replace Vite logo with 2nd Track mark; add favicon and touch icon ([2058bce](https://github.com/jingyieva/2nd_track_dashboard/commit/2058bce8893079af004396a57c5c751aae8c9760))
* **pagination:** 完成表格分頁功能與 UI 改進 ([bd16736](https://github.com/jingyieva/2nd_track_dashboard/commit/bd167366b1e1923392433c4f104995655f09f75d))
* **rwd:** center layout with container, responsive grid, and overflow guards ([5f0d523](https://github.com/jingyieva/2nd_track_dashboard/commit/5f0d5233b185d4f630c0da014d6ecc4b8a681896))
* **seo:** add meta description, canonical, OG/Twitter tags, theme-color and lang ([09d1712](https://github.com/jingyieva/2nd_track_dashboard/commit/09d1712146e2377fa7c211f1702c189f1f611b59))

### Performance Improvements

* Dashboard RWD 與 Lighthouse 優化 ([b14607a](https://github.com/jingyieva/2nd_track_dashboard/commit/b14607a3fdee766eef6034c2df322f7fb5f08b65))

## [1.3.0](https://github.com/jingyieva/2nd_track_dashboard/compare/v1.2.0...v1.3.0) (2025-08-01)

### Features

* **order:** implement initial Orders page with scaffold and mock data ([7f9d1dd](https://github.com/jingyieva/2nd_track_dashboard/commit/7f9d1dd115ec397b0dd68caa58b275807e20a131))
* **table:** build reusable data table with dynamic columns and flexible render logic ([cfcbe74](https://github.com/jingyieva/2nd_track_dashboard/commit/cfcbe742d3c773cab45af91fb0d21b3dfb148301))

## [1.2.0](https://github.com/jingyieva/2nd_track_dashboard/compare/v1.1.0...v1.2.0) (2025-07-31)

### Features

* **dashboard:** 完成圖表組件遷移與儀表板整合調整 ([ba6f85d](https://github.com/jingyieva/2nd_track_dashboard/commit/ba6f85d7adbdbf5776f455d0cb72d3beba052217))

## [1.1.0](https://github.com/jingyieva/2nd_track_dashboard/compare/v1.0.0...v1.1.0) (2025-07-25)

### Features

* **charts:** 完成 Chart.js 圖表元件與主題支援實作 ([7bea006](https://github.com/jingyieva/2nd_track_dashboard/commit/7bea0060e9e856f5c385dbe7ed82d5e601260ec8))

## [1.0.0](https://github.com/jingyieva/2nd_track_dashboard/compare/50f64548b0bb323b8a9990cebfe097908bdcd287...v1.0.0) (2025-07-24)

### Features

* integrate react-router-dom and scaffold initial route structure ([50f6454](https://github.com/jingyieva/2nd_track_dashboard/commit/50f64548b0bb323b8a9990cebfe097908bdcd287))
