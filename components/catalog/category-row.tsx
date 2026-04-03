"use client";

import React, { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api-client";
import type { Category } from "@/lib/catalog-types";

interface CategoryRowProps {
  category: Category;
  onUpdated: () => void;
  onDeleted: () => void;
}

export function CategoryRow({
  category,
  onUpdated,
  onDeleted,
}: CategoryRowProps): React.JSX.Element {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(category.name);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function handleSave(): Promise<void> {
    if (!editName.trim()) return;
    setIsSaving(true);
    setError(null);
    try {
      await apiClient.patch<Category>(`/categories/${category.id}`, {
        name: editName.trim(),
      });
      setIsEditing(false);
      onUpdated();
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e.message || "Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleDiscard(): void {
    setIsEditing(false);
    setError(null);
  }

  async function handleDelete(): Promise<void> {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setError(null);
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      await apiClient.delete<void>(`/categories/${category.id}`);
      onDeleted();
    } catch (err: unknown) {
      const e = err as { statusCode?: number; message?: string };
      if (e.statusCode === 409) {
        setError(
          "This category has products. Reassign or delete its products before deleting the category."
        );
      } else {
        setError(e.message || "Something went wrong. Please try again.");
      }
      setConfirmDelete(false);
    } finally {
      setIsSaving(false);
    }
  }

  if (confirmDelete) {
    return (
      <>
        <div className="flex items-center gap-2 py-3 px-4 border-b border-border bg-destructive/5">
          <span className="text-sm flex-1">
            Delete &ldquo;{category.name}&rdquo;? This cannot be undone.
          </span>
          <Button
            size="sm"
            variant="destructive"
            onClick={handleDelete}
            disabled={isSaving}
          >
            Confirm
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setConfirmDelete(false);
              setError(null);
            }}
            disabled={isSaving}
          >
            Cancel
          </Button>
        </div>
        {error && (
          <div className="px-4 py-2 text-sm text-destructive bg-destructive/5 border-b border-border">
            {error}
          </div>
        )}
      </>
    );
  }

  if (isEditing) {
    return (
      <>
        <div className="flex items-center gap-2 py-3 px-4 border-b border-border bg-muted/30">
          <Input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") handleDiscard();
            }}
            className="flex-1 h-9"
            autoFocus
          />
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSaving || !editName.trim()}
          >
            Save Name
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDiscard}
            disabled={isSaving}
          >
            Discard
          </Button>
        </div>
        {error && (
          <div className="px-4 py-2 text-sm text-destructive bg-destructive/5 border-b border-border">
            {error}
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between py-3 px-4 border-b border-border">
        <span className="text-sm font-medium">{category.name}</span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Edit category"
            onClick={() => {
              setIsEditing(true);
              setEditName(category.name);
              setError(null);
            }}
          >
            <Pencil className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Delete category"
            className="text-destructive hover:text-destructive"
            onClick={handleDelete}
            disabled={isSaving}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
      {error && (
        <div className="px-4 py-2 text-sm text-destructive bg-destructive/5 border-b border-border">
          {error}
        </div>
      )}
    </>
  );
}
