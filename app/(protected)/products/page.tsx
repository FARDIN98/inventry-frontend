import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FilterBar } from "@/components/catalog/filter-bar";
import { ProductTable } from "@/components/catalog/product-table";
import { Plus } from "lucide-react";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}): Promise<React.JSX.Element> {
  const params = await searchParams;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-heading tracking-tight">
            <span className="text-gradient-primary">Products</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Browse and manage your product catalog
          </p>
        </div>
        <Button asChild>
          <Link href="/products/new">
            <Plus className="size-4 mr-2" />
            Add Product
          </Link>
        </Button>
      </div>
      <Suspense
        fallback={
          <div className="h-14 bg-muted/50 rounded-lg animate-pulse" />
        }
      >
        <FilterBar />
      </Suspense>
      <ProductTable searchParams={params} />
    </div>
  );
}
