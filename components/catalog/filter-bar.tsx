"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import type { Category } from "@/lib/catalog-types";

export function FilterBar(): React.JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [searchValue, setSearchValue] = useState(
    searchParams.get("q") || ""
  );
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    apiClient
      .get<Category[]>("/categories")
      .then(setCategories)
      .catch(() => {
        // silently fail — categories dropdown degrades gracefully
      });
  }, []);

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      params.set("page", "1"); // D-10: filter changes reset pagination
      router.push(`/products?${params.toString()}`);
    },
    [searchParams, router]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      updateParams({ q: value });
    }, 300);
  };

  const handleCategoryChange = (value: string) => {
    updateParams({ category: value === "all" ? "" : value });
  };

  const handleStatusChange = (value: string) => {
    updateParams({ status: value === "all" ? "" : value });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 p-4 bg-muted/50 rounded-lg">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          value={searchValue}
          onChange={handleSearchChange}
          placeholder="Search products\u2026"
          className="pl-9"
        />
      </div>
      <Select
        value={searchParams.get("category") || "all"}
        onValueChange={handleCategoryChange}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="All categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All categories</SelectItem>
          {categories.map((c) => (
            <SelectItem key={c.id} value={c.id}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={searchParams.get("status") || "all"}
        onValueChange={handleStatusChange}
      >
        <SelectTrigger className="w-full sm:w-[160px]">
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="low_stock">Low Stock</SelectItem>
          <SelectItem value="out_of_stock">Out of Stock</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
