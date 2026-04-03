"use client";

import React, { useEffect, useState } from "react";
import { FolderOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api-client";
import type { Category } from "@/lib/catalog-types";
import { CategoryRow } from "@/components/catalog/category-row";

export function CategoryList(): React.JSX.Element {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [addError, setAddError] = useState<string | null>(null);

  async function fetchCategories(): Promise<void> {
    try {
      const data = await apiClient.get<Category[]>("/categories");
      setCategories(data);
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e.message || "Failed to load categories.");
    }
  }

  useEffect(() => {
    fetchCategories().finally(() => setLoading(false));
  }, []);

  async function handleAdd(): Promise<void> {
    if (!newName.trim()) return;
    setAddError(null);
    try {
      await apiClient.post<Category>("/categories", { name: newName.trim() });
      setIsAdding(false);
      setNewName("");
      await fetchCategories();
    } catch (err: unknown) {
      const e = err as { message?: string };
      setAddError(e.message || "Something went wrong. Please try again.");
    }
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-card">
        <div className="px-4 py-8 text-center text-sm text-muted-foreground">
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-border bg-card">
        <div className="px-4 py-8 text-center text-sm text-destructive">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          size="sm"
          onClick={() => {
            setIsAdding(true);
            setAddError(null);
          }}
          disabled={isAdding}
        >
          <Plus className="size-4" />
          Add Category
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {isAdding && (
          <>
            <div className="flex items-center gap-2 py-3 px-4 border-b border-border bg-muted/30">
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAdd();
                  if (e.key === "Escape") {
                    setIsAdding(false);
                    setNewName("");
                    setAddError(null);
                  }
                }}
                placeholder="Category name"
                className="flex-1 h-9"
                autoFocus
              />
              <Button size="sm" onClick={handleAdd} disabled={!newName.trim()}>
                Add Category
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsAdding(false);
                  setNewName("");
                  setAddError(null);
                }}
              >
                Cancel
              </Button>
            </div>
            {addError && (
              <div className="px-4 py-2 text-sm text-destructive bg-destructive/5 border-b border-border">
                {addError}
              </div>
            )}
          </>
        )}

        {categories.length === 0 && !isAdding ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FolderOpen className="size-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold">
              No categories yet
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Add your first category to start organizing products.
            </p>
          </div>
        ) : (
          categories.map((category) => (
            <CategoryRow
              key={category.id}
              category={category}
              onUpdated={fetchCategories}
              onDeleted={fetchCategories}
            />
          ))
        )}
      </div>
    </div>
  );
}
