import { create } from 'zustand';

/** 預設：全域視窗 30 天；平台不限 */
export const useFiltersStore = create((set) => ({
  preset: '30d',        // '7d' | '30d' | '90d' | 'all'
  platform: 'all',         // 'all' | 'shopee' | 'carousell' | 'other'（與後端一致）
  setPreset:  (preset)  => set({ preset }),
  setPlatform:(platform)=> set({ platform }),
  reset:                () => set({ preset: '30d', platform: '' }),
}));
