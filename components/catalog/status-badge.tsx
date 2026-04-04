import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { ProductStatus } from "@/lib/catalog-types";
import type { OrderStatus } from "@/lib/order-types";
import type { RestockPriority } from "@/lib/restock-types";

type AllStatus = ProductStatus | OrderStatus | RestockPriority;

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-normal",
  {
    variants: {
      status: {
        // Product statuses
        active: "bg-success/15 text-success",
        low_stock: "bg-warning/15 text-warning",
        out_of_stock: "bg-destructive/15 text-destructive",
        inactive: "bg-muted/50 text-muted-foreground line-through",
        // Order statuses
        pending: "bg-muted/30 text-muted-foreground",
        confirmed: "bg-primary/20 text-primary",
        shipped: "bg-primary/20 text-primary",
        delivered: "bg-success/15 text-success",
        cancelled: "bg-destructive/15 text-destructive",
        // Restock priority variants
        priority_high: "bg-destructive/15 text-destructive",
        priority_medium: "bg-warning/15 text-warning",
        priority_low: "bg-muted/30 text-muted-foreground",
      },
    },
    defaultVariants: {
      status: "active",
    },
  }
);

const statusLabels: Record<AllStatus, string> = {
  // Product statuses
  active: "Active",
  low_stock: "Low Stock",
  out_of_stock: "Out of Stock",
  inactive: "Inactive",
  // Order statuses
  pending: "Pending",
  confirmed: "Confirmed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  // Restock priorities
  priority_high: "High",
  priority_medium: "Medium",
  priority_low: "Low",
};

interface StatusBadgeProps extends VariantProps<typeof statusBadgeVariants> {
  status: AllStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps): React.JSX.Element {
  return (
    <span className={cn(statusBadgeVariants({ status }), className)}>
      {statusLabels[status]}
    </span>
  );
}
