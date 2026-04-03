"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/catalog/status-badge";
import { ProductPagination } from "@/components/catalog/product-pagination";
import { apiClient } from "@/lib/api-client";
import type { Product, PaginatedResponse } from "@/lib/catalog-types";
import { Pencil, Trash2, Package } from "lucide-react";

interface ProductTableProps {
  searchParams: Record<string, string>;
}

export function ProductTable({
  searchParams,
}: ProductTableProps): React.JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { q = "", category = "", status = "" } = searchParams;
      const pageParam = searchParams.page || "1";
      const limitParam = searchParams.limit || "25";

      const queryParts: string[] = [];
      if (q) queryParts.push(`q=${encodeURIComponent(q)}`);
      if (category) queryParts.push(`category=${encodeURIComponent(category)}`);
      if (status) queryParts.push(`status=${encodeURIComponent(status)}`);
      queryParts.push(`page=${pageParam}`);
      queryParts.push(`limit=${limitParam}`);

      const queryString = queryParts.join("&");
      const response = await apiClient.get<PaginatedResponse<Product>>(
        `/products?${queryString}`
      );

      setProducts(response.data);
      setTotal(response.total);
      setPage(response.page);
      setLimit(response.limit);
      setTotalPages(response.totalPages);
    } catch {
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (product: Product) => {
    const confirmed = window.confirm(
      `Delete "${product.name}"? This will permanently remove the product.`
    );
    if (!confirmed) return;

    try {
      await apiClient.delete(`/products/${product.id}`);
      await fetchProducts();
    } catch {
      alert("Failed to delete product. Please try again.");
    }
  };

  const hasFilters = !!(
    searchParams.q ||
    searchParams.category ||
    searchParams.status
  );

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

  if (products.length === 0) {
    return (
      <div className="border border-border rounded-lg p-12 text-center">
        <Package className="size-12 text-muted-foreground mx-auto mb-4" />
        {hasFilters ? (
          <>
            <h3 className="text-lg font-semibold mb-1">
              No products match your filters
            </h3>
            <p className="text-muted-foreground text-sm">
              Try adjusting your search or filters to find what you&apos;re
              looking for.
            </p>
          </>
        ) : (
          <>
            <h3 className="text-lg font-semibold mb-1">No products yet</h3>
            <p className="text-muted-foreground text-sm">
              Add your first product to start tracking inventory.
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-left text-sm font-bold text-muted-foreground px-4 py-3">
                Name
              </th>
              <th className="text-left text-sm font-bold text-muted-foreground px-4 py-3">
                Category
              </th>
              <th className="text-right text-sm font-bold text-muted-foreground px-4 py-3">
                Price
              </th>
              <th className="text-right text-sm font-bold text-muted-foreground px-4 py-3">
                Stock
              </th>
              <th className="text-right text-sm font-bold text-muted-foreground px-4 py-3">
                Min Threshold
              </th>
              <th className="text-left text-sm font-bold text-muted-foreground px-4 py-3">
                Status
              </th>
              <th className="text-right text-sm font-bold text-muted-foreground px-4 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-t border-border hover:bg-muted/20 h-12"
              >
                <td className="px-4 py-3 text-sm font-medium">
                  {product.name}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {product.category_name}
                </td>
                <td className="px-4 py-3 text-sm text-right">
                  ${Number(product.price).toFixed(2)}
                </td>
                <td className="px-4 py-3 text-sm text-right">
                  {product.stock_quantity}
                </td>
                <td className="px-4 py-3 text-sm text-right">
                  {product.min_stock_threshold}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={product.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Edit product"
                      asChild
                    >
                      <Link href={`/products/${product.id}/edit`}>
                        <Pencil className="size-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Delete product"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(product)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ProductPagination
        currentPage={page}
        totalPages={totalPages}
        currentLimit={limit}
        basePath="/products"
        searchParams={searchParams}
      />
    </div>
  );
}
