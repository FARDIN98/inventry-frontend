"use client";

import * as React from "react";
import { ProductPagination } from "@/components/catalog/product-pagination";

interface OrderPaginationProps {
  currentPage: number;
  totalPages: number;
  currentLimit: number;
  searchParams: Record<string, string>;
}

export function OrderPagination(props: OrderPaginationProps): React.JSX.Element {
  return <ProductPagination {...props} basePath="/orders" />;
}
