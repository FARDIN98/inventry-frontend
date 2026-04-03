import React from "react";
import { CategoryList } from "@/components/catalog/category-list";

export default function CategoriesPage(): React.JSX.Element {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Categories
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your product categories
        </p>
      </div>
      <CategoryList />
    </div>
  );
}
