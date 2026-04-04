"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiClient } from "@/lib/api-client";
import type { Category, Product } from "@/lib/catalog-types";

interface ProductFormProps {
  product?: Product;
  onSuccess?: () => void;
}

interface ApiErrorResponse {
  statusCode?: number;
  message?: string | string[];
}

export function ProductForm({ product, onSuccess }: ProductFormProps): React.JSX.Element {
  const router = useRouter();

  const [name, setName] = useState<string>(product?.name ?? "");
  const [categoryId, setCategoryId] = useState<string>(product?.category_id ?? "");
  const [price, setPrice] = useState<string>(product ? String(product.price) : "");
  const [stockQuantity, setStockQuantity] = useState<string>(
    product ? String(product.stock_quantity) : ""
  );
  const [minStockThreshold, setMinStockThreshold] = useState<string>(
    product ? String(product.min_stock_threshold) : ""
  );
  const [isActive, setIsActive] = useState<boolean>(product?.is_active ?? true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    async function fetchCategories(): Promise<void> {
      try {
        const data = await apiClient.get<Category[]>("/categories");
        setCategories(data);
      } catch {
        // Graceful failure — category dropdown will be empty but form remains usable
        setCategories([]);
      }
    }
    fetchCategories();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setErrors({});
    setGeneralError(null);

    // Client-side validation
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "This field is required";
    if (!categoryId) newErrors.category_id = "This field is required";
    if (!price.trim() || isNaN(Number(price)) || Number(price) < 0)
      newErrors.price = "Enter a valid price (e.g. 9.99)";
    if (
      !stockQuantity.trim() ||
      !Number.isInteger(Number(stockQuantity)) ||
      Number(stockQuantity) < 0
    )
      newErrors.stock_quantity = "Enter a whole number (e.g. 100)";
    if (
      !minStockThreshold.trim() ||
      !Number.isInteger(Number(minStockThreshold)) ||
      Number(minStockThreshold) < 0
    )
      newErrors.min_stock_threshold = "Enter a whole number (e.g. 10)";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const body = {
        name: name.trim(),
        category_id: categoryId,
        price: Number(price),
        stock_quantity: Number(stockQuantity),
        min_stock_threshold: Number(minStockThreshold),
        is_active: isActive,
      };

      if (product) {
        await apiClient.patch<Product>(`/products/${product.id}`, body);
      } else {
        await apiClient.post<Product>("/products", body);
      }

      onSuccess?.();
      router.push("/products");
    } catch (err) {
      const apiError = err as ApiErrorResponse;
      if (apiError.statusCode === 400 && Array.isArray(apiError.message)) {
        const fieldErrors: Record<string, string> = {};
        for (const msg of apiError.message) {
          const lower = msg.toLowerCase();
          if (lower.includes("name")) fieldErrors.name = msg;
          else if (lower.includes("category")) fieldErrors.category_id = msg;
          else if (lower.includes("price")) fieldErrors.price = msg;
          else if (lower.includes("stock_quantity") || lower.includes("stock quantity"))
            fieldErrors.stock_quantity = msg;
          else if (
            lower.includes("min_stock") ||
            lower.includes("min stock") ||
            lower.includes("threshold")
          )
            fieldErrors.min_stock_threshold = msg;
        }
        if (Object.keys(fieldErrors).length > 0) {
          setErrors(fieldErrors);
        } else {
          setGeneralError("Something went wrong. Please try again.");
        }
      } else {
        setGeneralError("Something went wrong. Please try again.");
      }
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
      <div className="space-y-2">
        <Label htmlFor="name">Product Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter product name"
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={categoryId} onValueChange={setCategoryId}>
          <SelectTrigger id="category" className="w-full">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category_id && (
          <p className="text-sm text-destructive">{errors.category_id}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          min="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="0.00"
        />
        {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="stock_quantity">Stock Quantity</Label>
        <Input
          id="stock_quantity"
          type="number"
          step="1"
          min="0"
          value={stockQuantity}
          onChange={(e) => setStockQuantity(e.target.value)}
          placeholder="0"
        />
        {errors.stock_quantity && (
          <p className="text-sm text-destructive">{errors.stock_quantity}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="min_stock_threshold">Min Stock Threshold</Label>
        <Input
          id="min_stock_threshold"
          type="number"
          step="1"
          min="0"
          value={minStockThreshold}
          onChange={(e) => setMinStockThreshold(e.target.value)}
          placeholder="0"
        />
        {errors.min_stock_threshold && (
          <p className="text-sm text-destructive">{errors.min_stock_threshold}</p>
        )}
      </div>

      {generalError && <p className="text-sm text-destructive">{generalError}</p>}

      {/* Active / Inactive toggle */}
      <div className="flex items-center gap-3 p-3 border border-border rounded-lg">
        <button
          type="button"
          role="switch"
          aria-checked={isActive}
          onClick={() => setIsActive((v) => !v)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            isActive ? 'bg-success' : 'bg-muted'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg transition-transform ${
              isActive ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
        <div>
          <p className="text-sm font-medium">
            {isActive ? 'Active' : 'Inactive'}
          </p>
          <p className="text-xs text-muted-foreground">
            {isActive
              ? 'Product is visible and can be ordered'
              : 'Product is hidden from orders — "This product is currently unavailable."'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : product ? "Update Product" : "Save Product"}
        </Button>
        <Button variant="ghost" type="button" asChild>
          <Link href="/products">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
