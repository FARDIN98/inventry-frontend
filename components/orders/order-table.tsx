"use client";

import * as React from "react";
import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/catalog/status-badge";
import { OrderPagination } from "@/components/orders/order-pagination";
import { apiClient } from "@/lib/api-client";
import type { Order, PaginatedOrders } from "@/lib/order-types";
import { ShoppingCart } from "lucide-react";

interface OrderTableProps {
  searchParams: Record<string, string>;
}

function formatOrderDate(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function OrderTable({
  searchParams,
}: OrderTableProps): React.JSX.Element {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [total, setTotal] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(25);
  const [totalPages, setTotalPages] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchOrders = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { dateRange = "", status = "" } = searchParams;
      const pageParam = searchParams.page || "1";
      const limitParam = searchParams.limit || "25";

      const queryParts: string[] = [];
      if (dateRange) queryParts.push(`dateRange=${encodeURIComponent(dateRange)}`);
      if (status) queryParts.push(`status=${encodeURIComponent(status)}`);
      queryParts.push(`page=${pageParam}`);
      queryParts.push(`limit=${limitParam}`);

      const queryString = queryParts.join("&");
      const response = await apiClient.get<PaginatedOrders>(
        `/orders?${queryString}`
      );

      setOrders(response.data);
      setTotal(response.total);
      setPage(response.page);
      setLimit(response.limit);
      setTotalPages(response.totalPages);
    } catch {
      setError("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const hasFilters = !!(searchParams.dateRange || searchParams.status);

  if (loading) {
    return (
      <div className="border border-border rounded-lg overflow-hidden animate-pulse">
        <div className="h-12 bg-muted/50" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 border-t border-border bg-muted/10" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-border rounded-lg p-8 text-center text-destructive">
        <p>{error}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="border border-border rounded-lg p-12 text-center">
        <ShoppingCart className="size-12 text-muted-foreground mx-auto mb-4" />
        {hasFilters ? (
          <>
            <h3 className="text-lg font-semibold mb-1">
              No orders match your filters
            </h3>
            <p className="text-muted-foreground text-sm">
              Try adjusting date range or status.
            </p>
          </>
        ) : (
          <>
            <h3 className="text-lg font-semibold mb-1">No orders yet</h3>
            <p className="text-muted-foreground text-sm">
              Create your first order to get started. Orders will appear here as
              you manage them.
            </p>
            <Button asChild className="mt-4">
              <Link href="/orders/new">Create Order</Link>
            </Button>
          </>
        )}
      </div>
    );
  }

  // suppress unused variable warning — total is used for display context
  void total;

  return (
    <div className="space-y-4">
      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50">
              <th
                scope="col"
                className="text-left text-sm font-bold text-muted-foreground px-4 py-3"
              >
                Order ID
              </th>
              <th
                scope="col"
                className="text-left text-sm font-bold text-muted-foreground px-4 py-3"
              >
                Customer
              </th>
              <th
                scope="col"
                className="text-left text-sm font-bold text-muted-foreground px-4 py-3"
              >
                Status
              </th>
              <th
                scope="col"
                className="text-right text-sm font-bold text-muted-foreground px-4 py-3"
              >
                Total
              </th>
              <th
                scope="col"
                className="text-left text-sm font-bold text-muted-foreground px-4 py-3"
              >
                Date
              </th>
              <th
                scope="col"
                className="text-center text-sm font-bold text-muted-foreground px-4 py-3"
              >
                Items
              </th>
              <th
                scope="col"
                className="text-right text-sm font-bold text-muted-foreground px-4 py-3"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-t border-border hover:bg-muted/20 h-12"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/orders/${order.id}`}
                    className="font-mono text-sm text-primary hover:underline"
                  >
                    ORD-{order.id.slice(0, 8).toUpperCase()}
                  </Link>
                </td>
                <td className="px-4 py-3 text-sm font-medium">
                  {order.customer_name}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={order.status} />
                </td>
                <td className="px-4 py-3 text-sm text-right">
                  ${Number(order.total_price).toFixed(2)}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {formatOrderDate(order.created_at)}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="inline-flex items-center justify-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                    {order.item_count}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/orders/${order.id}`}>View</Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <OrderPagination
        currentPage={page}
        totalPages={totalPages}
        currentLimit={limit}
        searchParams={searchParams}
      />
    </div>
  );
}
