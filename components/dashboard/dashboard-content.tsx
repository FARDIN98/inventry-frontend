'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type {
  DashboardStats,
  LowStockProduct,
  ActivityEntry,
  ChartDataPoint,
} from '@/lib/dashboard-types';
import { apiClient } from '@/lib/api-client';
import { DashboardMetricCard } from '@/components/dashboard/dashboard-metric-card';
import { StockSummary } from '@/components/dashboard/stock-summary';
import { ActivityLog } from '@/components/dashboard/activity-log';
import { OrdersChart } from '@/components/dashboard/orders-chart';
import { ShoppingCart, Package, AlertTriangle, TrendingUp } from 'lucide-react';

export function DashboardContent(): React.JSX.Element {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [lowStock, setLowStock] = useState<LowStockProduct[]>([]);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const [statsData, lowStockData, activityData, chartDataResult] =
        await Promise.all([
          apiClient.get<DashboardStats>('/dashboard/stats'),
          apiClient.get<LowStockProduct[]>('/dashboard/low-stock'),
          apiClient.get<ActivityEntry[]>('/dashboard/activity'),
          apiClient.get<ChartDataPoint[]>('/dashboard/chart'),
        ]);
      setStats(statsData);
      setLowStock(lowStockData);
      setActivity(activityData);
      setChartData(chartDataResult);
    } catch {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 rounded-xl bg-muted/30 animate-pulse" />
          ))}
        </div>
        <div className="h-64 rounded-xl bg-muted/30 animate-pulse" />
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-64 rounded-xl bg-muted/30 animate-pulse" />
          <div className="h-64 rounded-xl bg-muted/30 animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  return (
    <div className="space-y-8">
      {/* KPI Cards Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardMetricCard
          icon={<ShoppingCart className="size-5" />}
          iconClassName="text-secondary"
          label="Orders Today"
          value={stats!.orders_today}
        />
        <DashboardMetricCard
          icon={<Package className="size-5" />}
          iconClassName="text-primary"
          label="Order Status"
          value={stats!.pending_count + stats!.completed_count}
          subLabel={`${stats!.pending_count} pending · ${stats!.completed_count} completed`}
        />
        <DashboardMetricCard
          icon={<AlertTriangle className="size-5" />}
          iconClassName="text-warning"
          label="Low Stock Items"
          value={stats!.low_stock_count}
        />
        <DashboardMetricCard
          icon={<TrendingUp className="size-5" />}
          iconClassName="text-success"
          label="Revenue Today"
          value={`$${Number(stats!.revenue_today).toFixed(2)}`}
        />
      </div>

      {/* Chart — full width */}
      <OrdersChart data={chartData} />

      {/* Stock Summary + Activity Log — 2-col grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <StockSummary items={lowStock} />
        <ActivityLog entries={activity} />
      </div>
    </div>
  );
}
