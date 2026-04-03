"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/lib/api-client";
import type { RestockItem } from "@/lib/restock-types";

interface RestockDialogProps {
  item: RestockItem | null;
  onClose: () => void;
  onRestocked: () => void;
}

export default function RestockDialog({
  item,
  onClose,
  onRestocked,
}: RestockDialogProps): React.JSX.Element {
  const [newQuantity, setNewQuantity] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const open = item !== null;

  useEffect(() => {
    setNewQuantity("");
    setError(null);
  }, [item]);

  async function handleRestock(): Promise<void> {
    const qty = parseInt(newQuantity, 10);
    if (isNaN(qty) || qty <= 0) {
      setError("Enter a valid quantity greater than 0");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await apiClient.patch(`/products/${item!.id}`, { stock_quantity: qty });
      onRestocked();
      onClose();
    } catch {
      setError("Failed to restock. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent className="max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Restock {item?.name}</DialogTitle>
          <DialogDescription className="sr-only">
            Update stock quantity for {item?.name}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-2 text-sm py-3">
          <span className="text-muted-foreground">Current Stock</span>
          <span className="font-medium text-right">{item?.stock_quantity} units</span>
          <span className="text-muted-foreground">Threshold</span>
          <span className="font-medium text-right">{item?.min_stock_threshold} units</span>
        </div>

        <div className="space-y-2">
          <Label htmlFor="new-quantity">New Stock Quantity</Label>
          <Input
            id="new-quantity"
            type="number"
            min="1"
            value={newQuantity}
            onChange={(e) => setNewQuantity(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Current: {item?.stock_quantity} | Threshold: {item?.min_stock_threshold}
          </p>
          {error && (
            <p className="text-sm text-destructive" aria-live="polite">
              {error}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-gradient-primary text-white shadow-gradient"
            type="button"
            disabled={isSubmitting}
            onClick={() => void handleRestock()}
          >
            {isSubmitting ? "Restocking..." : "Confirm Restock"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
