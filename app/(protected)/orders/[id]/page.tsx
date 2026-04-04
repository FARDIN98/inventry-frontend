"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusBadge } from "@/components/catalog/status-badge";
import { OrderStepper } from "@/components/orders/order-stepper";
import { apiClient } from "@/lib/api-client";
import type { Order, OrderStatus } from "@/lib/order-types";

export default function OrderDetailPage(): React.JSX.Element {
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [isActioning, setIsActioning] = useState(false);

  const fetchOrder = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiClient.get<Order>(`/orders/${orderId}`);
      setOrder(data);
    } catch {
      setError("Order not found or could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  async function handleStatusAdvance(newStatus: string): Promise<void> {
    setIsActioning(true);
    setActionError(null);
    try {
      await apiClient.patch(`/orders/${orderId}/status`, { status: newStatus });
      await fetchOrder();
    } catch (err) {
      const e = err as { message?: string };
      setActionError(e.message || "Failed to update order status.");
    } finally {
      setIsActioning(false);
    }
  }

  async function handleCancel(): Promise<void> {
    setIsActioning(true);
    setActionError(null);
    try {
      await apiClient.patch(`/orders/${orderId}/status`, { status: "cancelled" });
      setConfirmCancel(false);
      await fetchOrder();
    } catch (err) {
      const e = err as { message?: string };
      setActionError(e.message || "Failed to cancel order.");
    } finally {
      setIsActioning(false);
    }
  }

  function renderActionButtons(status: OrderStatus): React.JSX.Element | null {
    if (status === "delivered" || status === "cancelled") return null;
    return (
      <div className="flex items-center gap-3 flex-wrap">
        {status === "pending" && (
          <Button
            onClick={() => handleStatusAdvance("confirmed")}
            disabled={isActioning}
          >
            Confirm Order
          </Button>
        )}
        {status === "confirmed" && (
          <Button
            onClick={() => handleStatusAdvance("shipped")}
            disabled={isActioning}
          >
            Mark as Shipped
          </Button>
        )}
        {status === "shipped" && (
          <Button
            onClick={() => handleStatusAdvance("delivered")}
            disabled={isActioning}
          >
            Mark as Delivered
          </Button>
        )}
        {(status === "pending" || status === "confirmed") && !confirmCancel && (
          <Button
            variant="destructive"
            onClick={() => setConfirmCancel(true)}
            disabled={isActioning}
          >
            Cancel Order
          </Button>
        )}
        {confirmCancel && (
          <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3">
            <p className="text-sm text-destructive">
              Cancel order? This will restore{" "}
              {order?.item_count ?? 0} product(s) to inventory.
            </p>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleCancel}
              disabled={isActioning}
            >
              {isActioning ? "Cancelling..." : "Yes, Cancel"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setConfirmCancel(false)}
              disabled={isActioning}
            >
              Keep Order
            </Button>
          </div>
        )}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-10 bg-muted rounded-lg w-1/3" />
        <div className="h-24 bg-muted rounded-xl" />
        <div className="h-48 bg-muted rounded-xl" />
        <div className="h-16 bg-muted rounded-xl" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-destructive p-8">
        {error ?? "Order not found."}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold">
              ORD-{order.id.slice(0, 8).toUpperCase()}
            </h1>
            <StatusBadge status={order.status} />
          </div>
          <p className="text-muted-foreground text-sm">
            {order.customer_name} &middot;{" "}
            {new Date(order.created_at).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/orders">Back to Orders</Link>
        </Button>
      </div>

      {/* Stepper */}
      <Card>
        <CardContent className="pt-6">
          <OrderStepper currentStatus={order.status} />
        </CardContent>
      </Card>

      {/* Action error */}
      {actionError && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive"
        >
          {actionError}
        </div>
      )}

      {/* Action buttons */}
      {renderActionButtons(order.status)}

      {/* Line Items */}
      <Card>
        <CardHeader>
          <CardTitle>Items ({order.items?.length ?? 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th
                    scope="col"
                    className="text-left text-sm font-bold text-muted-foreground px-4 py-3"
                  >
                    Product
                  </th>
                  <th
                    scope="col"
                    className="text-right text-sm font-bold text-muted-foreground px-4 py-3"
                  >
                    Unit Price
                  </th>
                  <th
                    scope="col"
                    className="text-right text-sm font-bold text-muted-foreground px-4 py-3"
                  >
                    Qty
                  </th>
                  <th
                    scope="col"
                    className="text-right text-sm font-bold text-muted-foreground px-4 py-3"
                  >
                    Line Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {(order.items ?? []).map((item) => (
                  <tr key={item.id} className="border-t border-border">
                    <td className="px-4 py-3 text-sm font-medium">
                      {item.product_name}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      ${Number(item.unit_price).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-medium">
                      ${(Number(item.unit_price) * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">Order Total</span>
            <span className="text-2xl font-bold">
              ${Number(order.total_price).toFixed(2)}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
