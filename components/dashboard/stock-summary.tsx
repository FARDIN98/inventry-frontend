import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/catalog/status-badge';
import type { LowStockProduct } from '@/lib/dashboard-types';

interface StockSummaryProps {
  items: LowStockProduct[];
}

export function StockSummary({ items }: StockSummaryProps): React.JSX.Element {
  return (
    <Card className="bg-gradient-surface ring-1 ring-foreground/10">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          At-Risk Products
        </CardTitle>
        <Link
          href="/restock"
          className="text-xs text-primary hover:underline"
        >
          View Restock Queue &rarr;
        </Link>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">All products stocked</p>
        ) : (
          <div>
            {items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center py-2 border-b last:border-0"
              >
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.stock_quantity} in stock
                  </p>
                </div>
                <StatusBadge status={item.status} />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
