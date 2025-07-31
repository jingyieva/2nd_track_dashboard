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
  options = { chart: {}, container: {}},
  isLoading = false,
  fallback = null,
  className = '',
}) {
  const { resolvedTheme } = useTheme();
  const ChartComponent = chartType[variant];
  const chartRef = useRef(null);

  if (isLoading) {
    return (
      <div className={cn('flex items-center justify-center w-full h-64', className)}>
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  if (!data || data.length === 0) {
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
            data={data}
            chartConfig={options?.chart}
            containerConfig={options?.container}
        />
    </div>
  );
}
