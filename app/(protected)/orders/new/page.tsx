"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProductSelector } from "@/components/orders/product-selector";
import { OrderLineItemRow, type LineItem } from "@/components/orders/order-line-item-row";
import { StockWarningAlert } from "@/components/orders/stock-warning-alert";
import { apiClient } from "@/lib/api-client";
import type { Product } from "@/lib/catalog-types";
import type { CreateOrderPayload, Order } from "@/lib/order-types";

export default function NewOrderPage(): React.JSX.Element {
  const router = useRouter();

  const [customerName, setCustomerName] = useState("");
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [stockError, setStockError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const total = lineItems.reduce(
    (sum, item) => sum + item.unit_price * item.quantity,
    0
  );
  const hasStockViolations = lineItems.some(
    (item) => item.quantity > item.available_stock
  );

  function handleProductSelect(product: Product): void {
    setLineItems((prev) => [
      ...prev,
      {
        product_id: product.id,
        product_name: product.name,
        unit_price: Number(product.price),
        quantity: 1,
        available_stock: product.stock_quantity,
      },
    ]);
    // Clear items field error when product is added
    if (fieldErrors.items) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next.items;
        return next;
      });
    }
  }

  function handleQuantityChange(productId: string, newQty: number): void {
    setLineItems((prev) =>
      prev.map((item) =>
        item.product_id === productId
          ? { ...item, quantity: Math.max(1, newQty) }
          : item
      )
    );
  }

  function handleRemoveItem(productId: string): void {
    setLineItems((prev) => prev.filter((item) => item.product_id !== productId));
  }

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!customerName.trim()) newErrors.customerName = "Customer name is required";
    if (lineItems.length === 0) newErrors.items = "Add at least one product";
    if (hasStockViolations)
      newErrors.items = "Update quantities — some items exceed available stock";
    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setStockError(null);
    setFieldErrors({});
    try {
      const payload: CreateOrderPayload = {
        customer_name: customerName.trim(),
        items: lineItems.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
      };
      const order = await apiClient.post<Order>(
        "/orders",
        payload as unknown as Record<string, unknown>
      );
      router.push(`/orders/${order.id}`);
    } catch (err) {
      const apiError = err as { statusCode?: number; message?: string };
      if (apiError.statusCode === 400 || apiError.statusCode === 409) {
        setStockError(
          apiError.message || "Stock unavailable. Please update quantities."
        );
      } else {
        setStockError("Something went wrong. Please try again.");
      }
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Create Order
        </h1>
        <p className="text-muted-foreground mt-1">
          Add products and confirm order details
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {stockError && (
          <StockWarningAlert
            message={stockError}
            onDismiss={() => setStockError(null)}
          />
        )}

        {/* Customer Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Customer Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="customer-name">
                Customer Name <span aria-hidden="true">*</span>
              </Label>
              <Input
                id="customer-name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name"
                aria-required="true"
                aria-describedby={
                  fieldErrors.customerName ? "customer-name-error" : undefined
                }
              />
              {fieldErrors.customerName && (
                <p id="customer-name-error" className="text-sm text-destructive">
                  {fieldErrors.customerName}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Line Items */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Products</CardTitle>
              <ProductSelector
                onSelect={handleProductSelect}
                excludeProductIds={lineItems.map((i) => i.product_id)}
              />
            </div>
          </CardHeader>
          <CardContent>
            {lineItems.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                No products added yet. Use &quot;Select Product&quot; to add items.
              </p>
            ) : (
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
                        Quantity
                      </th>
                      <th
                        scope="col"
                        className="text-right text-sm font-bold text-muted-foreground px-4 py-3"
                      >
                        Total
                      </th>
                      <th
                        scope="col"
                        className="text-right text-sm font-bold text-muted-foreground px-4 py-3"
                      >
                        Remove
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {lineItems.map((item) => (
                      <OrderLineItemRow
                        key={item.product_id}
                        item={item}
                        onQuantityChange={handleQuantityChange}
                        onRemove={handleRemoveItem}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {fieldErrors.items && (
              <p className="text-sm text-destructive mt-2">
                {fieldErrors.items}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Order Summary */}
        {lineItems.length > 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">Order Total</span>
                <span className="text-2xl font-bold">
                  ${total.toFixed(2)}
                </span>
              </div>
              {hasStockViolations && (
                <p className="text-sm text-destructive mt-2">
                  Some items exceed available stock. Update quantities before
                  confirming.
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button
            type="submit"
            disabled={isSubmitting || hasStockViolations}
            className=""
          >
            {isSubmitting ? "Placing Order..." : "Confirm Order"}
          </Button>
          <Button variant="ghost" type="button" asChild>
            <Link href="/orders">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
