"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { apiClient } from "@/lib/api-client";
import type { Product, PaginatedResponse } from "@/lib/catalog-types";

interface ProductSelectorProps {
  onSelect: (product: Product) => void;
  excludeProductIds: string[];
}

export function ProductSelector({
  onSelect,
  excludeProductIds,
}: ProductSelectorProps): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Fetch initial product list on mount
    void fetchProducts("");
  }, []);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      void fetchProducts(searchValue);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchValue]);

  async function fetchProducts(query: string): Promise<void> {
    setLoading(true);
    try {
      const result = await apiClient.get<PaginatedResponse<Product>>(
        `/products?q=${encodeURIComponent(query)}&limit=50`
      );
      setProducts(result.data);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-auto justify-between">
          Select Product
          <ChevronsUpDown className="ml-2 size-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput
            placeholder="Search products..."
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            {loading && <CommandEmpty>Searching...</CommandEmpty>}
            {!loading && products.filter((p) => !excludeProductIds.includes(p.id)).length === 0 && (
              <CommandEmpty>No products found.</CommandEmpty>
            )}
            <CommandGroup>
              {products
                .filter((p) => !excludeProductIds.includes(p.id))
                .map((product) => (
                  <CommandItem
                    key={product.id}
                    value={product.id}
                    disabled={product.stock_quantity === 0}
                    onSelect={() => {
                      if (product.stock_quantity === 0) return;
                      onSelect(product);
                      setOpen(false);
                      setSearchValue("");
                    }}
                    className={
                      product.stock_quantity === 0
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-medium">{product.name}</span>
                      <span
                        className={`text-xs ml-2 ${
                          product.stock_quantity === 0
                            ? "text-destructive"
                            : "text-muted-foreground"
                        }`}
                      >
                        {product.stock_quantity === 0
                          ? "Out of Stock"
                          : `Available: ${product.stock_quantity} units`}
                      </span>
                    </div>
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
