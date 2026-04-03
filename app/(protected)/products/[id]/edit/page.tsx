"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { ProductForm } from "@/components/catalog/product-form";
import type { Product } from "@/lib/catalog-types";

export default function EditProductPage(): React.JSX.Element {
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct(): Promise<void> {
      try {
        const data = await apiClient.get<Product>(`/products/${id}`);
        setProduct(data);
      } catch {
        setError("Product not found");
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="h-96 w-full max-w-lg bg-muted animate-pulse rounded" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="space-y-4">
        <Link
          href="/products"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
        >
          <ArrowLeft className="size-4" />
          Back to Products
        </Link>
        <p className="text-destructive">{error ?? "Product not found"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/products"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 mb-4"
        >
          <ArrowLeft className="size-4" />
          Back to Products
        </Link>
        <h1 className="text-3xl font-bold font-heading tracking-tight">
          <span className="text-gradient-primary">Edit Product</span>
        </h1>
        <p className="text-muted-foreground mt-1">Update product details</p>
      </div>
      <ProductForm product={product} />
    </div>
  );
}
