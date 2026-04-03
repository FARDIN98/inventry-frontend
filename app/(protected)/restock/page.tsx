"use client";

import React, { useState, useEffect, useCallback } from "react";
import { TrendingDown } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import type { RestockItem } from "@/lib/restock-types";
import RestockQueueTable from "@/components/restock/restock-queue-table";
import { Card, CardContent } from "@/components/ui/card";

export default function RestockPage(): React.JSX.Element {
  const [items, setItems] = useState<RestockItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.get<RestockItem[]>("/restock");
      setItems(data);
    } catch {
      setError("Failed to load restock queue. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchItems();
  }, [fetchItems]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-heading tracking-tight">
          <span className="text-gradient-primary">Restock Queue</span>
        </h1>
        <p className="text-muted-foreground mt-1">
          Products below minimum stock threshold, ordered by priority.
        </p>
      </div>

      {loading && (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 bg-muted/30 rounded animate-pulse" />
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error}{" "}
          <button
            onClick={() => void fetchItems()}
            className="underline ml-2"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <Card className="flex flex-col items-center justify-center py-16 text-center">
          <CardContent>
            <TrendingDown className="size-12 text-muted-foreground/40 mx-auto mb-4" />
            <h2 className="text-lg font-semibold font-heading">
              All products are stocked
            </h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-sm">
              Products will appear here when they fall below their minimum stock
              threshold. Keep monitoring your inventory.
            </p>
          </CardContent>
        </Card>
      )}

      {!loading && !error && items.length > 0 && (
        <RestockQueueTable items={items} onRefetch={fetchItems} />
      )}
    </div>
  );
}
