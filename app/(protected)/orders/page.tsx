import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { OrderFilterBar } from "@/components/orders/order-filter-bar";
import { OrderTable } from "@/components/orders/order-table";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}): Promise<React.JSX.Element> {
  const params = await searchParams;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Orders
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage customer orders and track fulfillment
          </p>
        </div>
        <Button asChild>
          <Link href="/orders/new">
            <Plus className="size-4 mr-2" />
            Create Order
          </Link>
        </Button>
      </div>
      <Suspense
        fallback={
          <div className="h-14 bg-muted/50 rounded-lg animate-pulse" />
        }
      >
        <OrderFilterBar />
      </Suspense>
      <OrderTable searchParams={params} />
    </div>
  );
}
