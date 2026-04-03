"use client";

import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface LineItem {
  product_id: string;
  product_name: string;
  unit_price: number;
  quantity: number;
  available_stock: number;
}

interface OrderLineItemRowProps {
  item: LineItem;
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export function OrderLineItemRow({
  item,
  onQuantityChange,
  onRemove,
}: OrderLineItemRowProps): React.JSX.Element {
  const isOverStock = item.quantity > item.available_stock;

  return (
    <tr className="border-b border-border last:border-0">
      <td className="px-4 py-3">
        <span className="text-sm font-medium">{item.product_name}</span>
      </td>
      <td className="px-4 py-3 text-right">
        <span className="text-sm">${item.unit_price.toFixed(2)}</span>
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex flex-col items-end gap-0.5">
          <Input
            type="number"
            min={1}
            max={item.available_stock}
            value={item.quantity}
            onChange={(e) => {
              const newQty = parseInt(e.target.value, 10);
              if (!isNaN(newQty) && newQty >= 1) {
                onQuantityChange(item.product_id, newQty);
              }
            }}
            className="w-20 text-right"
            aria-label={`Quantity for ${item.product_name}`}
          />
          {isOverStock && (
            <p className="text-xs text-destructive mt-0.5">
              Only {item.available_stock} available
            </p>
          )}
        </div>
      </td>
      <td className="px-4 py-3 text-right">
        <span
          className={`text-sm font-medium ${isOverStock ? "text-destructive" : ""}`}
        >
          ${(item.unit_price * item.quantity).toFixed(2)}
        </span>
      </td>
      <td className="px-4 py-3 text-right">
        <Button
          variant="ghost"
          size="icon-sm"
          type="button"
          onClick={() => onRemove(item.product_id)}
          className="text-destructive hover:text-destructive"
          aria-label="Remove item"
        >
          <X className="size-4" />
        </Button>
      </td>
    </tr>
  );
}
