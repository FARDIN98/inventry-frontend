import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DashboardMetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subLabel?: string;
  iconClassName?: string;
}

export function DashboardMetricCard({
  icon,
  label,
  value,
  subLabel,
  iconClassName,
}: DashboardMetricCardProps): React.JSX.Element {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
        <span className={cn('size-5', iconClassName)}>{icon}</span>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subLabel && (
          <p className="text-xs text-muted-foreground mt-1">{subLabel}</p>
        )}
      </CardContent>
    </Card>
  );
}
