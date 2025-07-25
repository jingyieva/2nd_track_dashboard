// src/components/charts/ChartRenderer.jsx
import { useMemo, useRef } from 'react';
import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import { useTheme } from '@/contexts/theme-context';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

import { chart as chartType } from '@/components/charts/types'
import { LIGHT_THEME, DARK_THEME } from '@/constants/charts';


ChartJS.register(
  BarElement,
  ArcElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
);


export function ChartRenderer({
  variant = 'Bar',
  data,
  options,
  isLoading = false,
  fallback = null,
  className = '',
}) {
  const { resolvedTheme } = useTheme();
  const chartConf = chartType[variant];
  const ChartComponent = chartConf.component;
  const dueData = chartConf.formatData(data, resolvedTheme === 'dark' ? DARK_THEME : LIGHT_THEME); 
  const chartRef = useRef(null);

  const themedOptions = useMemo(() => {
    const isDark = resolvedTheme === 'dark';
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        colors: {
            forceOverride: true
        },
        legend: {
          labels: {
            color: isDark ? DARK_THEME.textColor : LIGHT_THEME.textColor,
          },
        },
        title: {
          display: options?.plugins?.title?.display || false,
          text: options?.plugins?.title?.text || '',
          color: isDark ? DARK_THEME.textColor : LIGHT_THEME.textColor,
        },
      },
      scales: {
        x: {
          ticks: { color: isDark ? DARK_THEME.tickColor : LIGHT_THEME.tickColor },
          grid: { color: isDark ? DARK_THEME.gridColor : LIGHT_THEME.gridColor },
        },
        y: {
          ticks: { color: isDark ? DARK_THEME.tickColor : LIGHT_THEME.tickColor },
          grid: { color: isDark ? DARK_THEME.gridColor : LIGHT_THEME.gridColor },
        },
      },
      ...options,
    };
  }, [resolvedTheme, options]);

  if (isLoading) {
    return (
      <div className={cn('flex items-center justify-center w-full h-64', className)}>
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  if (!data || !data.datas || data.datas.length === 0) {
    return (
      <div
        className={cn(
          'flex items-center justify-center w-full h-64 text-muted-foreground',
          className
        )}
      >
        {fallback ?? 'No data available'}
      </div>
    );
  }

  return (
    <div className={cn('w-full', className)}>
      <ChartComponent 
        ref={chartRef}        
        data={dueData}
        options={themedOptions} />
    </div>
  );
}
