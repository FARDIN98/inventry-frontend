import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { ProductStatus } from "@/lib/catalog-types";

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-normal",
  {
    variants: {
      status: {
        active: "bg-success/15 text-success",
        low_stock: "bg-warning/15 text-warning",
        out_of_stock: "bg-destructive/15 text-destructive",
      },
    },
    defaultVariants: {
      status: "active",
    },
  }
);

const statusLabels: Record<ProductStatus, string> = {
  active: "Active",
  low_stock: "Low Stock",
  out_of_stock: "Out of Stock",
};

interface StatusBadgeProps extends VariantProps<typeof statusBadgeVariants> {
  status: ProductStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps): React.JSX.Element {
  return (
    <span className={cn(statusBadgeVariants({ status }), className)}>
      {statusLabels[status]}
    </span>
  );
}
