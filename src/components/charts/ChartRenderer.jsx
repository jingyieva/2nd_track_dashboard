// src/components/charts/ChartRenderer.jsx
import { useRef } from 'react';

// import { useTheme } from '@/contexts/theme-context';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

import { chart as chartType } from '@/components/charts/types';

export function ChartRenderer({
  name,
  variant = 'Bar',
  data,
  options = { chart: {}, container: {}},
  isLoading = false,
  fallback = null,
  className = '',
}) {
  // const { resolvedTheme } = useTheme();
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
            name={name}
            data={data}
            chartConfig={options?.chart}
            containerConfig={options?.container}
        />
    </div>
  );
}
