'use client';

import React from 'react';
import type { ChartDataPoint } from '@/lib/dashboard-types';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

const chartConfig = {
  count: {
    label: 'Orders',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

interface OrdersChartProps {
  data: ChartDataPoint[];
}

export function OrdersChart({ data }: OrdersChartProps): React.JSX.Element {
  return (
    <Card className="bg-gradient-surface ring-1 ring-foreground/10">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Orders This Month
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-[300px] text-sm text-muted-foreground">
            No order data yet
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="date"
                tickFormatter={(value: string) => {
                  const d = new Date(value);
                  return `${d.getMonth() + 1}/${d.getDate()}`;
                }}
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="count"
                stroke="var(--color-count)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
