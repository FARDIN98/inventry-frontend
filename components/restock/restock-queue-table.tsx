"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/catalog/status-badge";
import RestockDialog from "@/components/restock/restock-dialog";
import type { RestockItem, RestockPriority } from "@/lib/restock-types";

interface RestockQueueTableProps {
  items: RestockItem[];
  onRefetch: () => void;
}

export default function RestockQueueTable({
  items,
  onRefetch,
}: RestockQueueTableProps): React.JSX.Element {
  const [selectedItem, setSelectedItem] = useState<RestockItem | null>(null);

  return (
    <>
      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50">
              <th
                scope="col"
                className="text-left text-sm font-bold text-muted-foreground px-4 py-3"
              >
                Product
              </th>
              <th
                scope="col"
                className="text-left text-sm font-bold text-muted-foreground px-4 py-3 hidden sm:table-cell"
              >
                Category
              </th>
              <th
                scope="col"
                className="text-right text-sm font-bold text-muted-foreground px-4 py-3"
              >
                Stock
              </th>
              <th
                scope="col"
                className="text-right text-sm font-bold text-muted-foreground px-4 py-3 hidden sm:table-cell"
              >
                Threshold
              </th>
              <th
                scope="col"
                className="text-left text-sm font-bold text-muted-foreground px-4 py-3"
              >
                Priority
              </th>
              <th
                scope="col"
                className="text-right text-sm font-bold text-muted-foreground px-4 py-3"
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className="border-t border-border hover:bg-muted/20 transition-colors h-12"
              >
                <td className="px-4 py-3 text-sm font-medium">{item.name}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground hidden sm:table-cell">
                  {item.category_name}
                </td>
                <td className="px-4 py-3 text-sm text-right font-mono">
                  {item.stock_quantity}
                </td>
                <td className="px-4 py-3 text-sm text-right text-muted-foreground hidden sm:table-cell">
                  {item.min_stock_threshold}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge
                    status={`priority_${item.priority}` as RestockPriority}
                  />
                </td>
                <td className="px-4 py-3 text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedItem(item)}
                  >
                    Add to Stock
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <RestockDialog
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onRestocked={() => {
          setSelectedItem(null);
          onRefetch();
        }}
      />
    </>
  );
}
