// src/pages/Dashboard/FiltersBar.jsx
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useFiltersStore } from '@/stores/filters';

const presets = [
    { label: '近 7 天', value: '7d' },
    { label: '近 30 天', value: '30d' },
    { label: '近 90 天', value: '90d' },
    { label: '全部', value: 'all' },
];
const platforms = [
    { label: '全部', value: 'all' },
    { label: '蝦皮', value: 'shopee' },
    { label: '旋轉', value: 'carousell' },
    { label: '其他', value: 'other' },
];

export default function FiltersBar() {
    const { preset, platform, setPreset, setPlatform } = useFiltersStore();

    return (
        <div className="flex flex-col md:flex-row flex-wrap items-center lg:justify-end gap-3">
            <label className="text-sm text-muted-foreground hidden md:block">區間</label>
            <ToggleGroup
                type="single"
                value={preset}
                onValueChange={(value) => value && setPreset(value)}
                aria-label="區間篩選"
            >
                {
                    presets.map(p => (
                        <ToggleGroupItem key={p.value} value={p.value} className={`px-3 py-1`} aria-pressed={preset === p.value} aria-label={p.label}>
                            {p.label}
                        </ToggleGroupItem>
                    ))
                }
            </ToggleGroup>

            <label className="text-sm text-muted-foreground hidden md:block">平台</label>
            <ToggleGroup
                type="single"
                value={platform}
                onValueChange={(value) => value && setPlatform(value)}
                aria-label="平台篩選"
            >
                {
                    platforms.map(p => (
                        <ToggleGroupItem key={p.value} value={p.value} className={`px-3 py-1 `} aria-pressed={platform === p.value} aria-label={p.label}>
                            {p.label}
                        </ToggleGroupItem>
                    ))
                }
            </ToggleGroup>
        </div>
    );
}
