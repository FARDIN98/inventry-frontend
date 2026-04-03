import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProductForm } from "@/components/catalog/product-form";

export default function NewProductPage(): React.JSX.Element {
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
        <h1 className="text-3xl font-semibold tracking-tight">
          Add Product
        </h1>
        <p className="text-muted-foreground mt-1">
          Add a new product to your inventory
        </p>
      </div>
      <ProductForm />
    </div>
  );
}
