"use client";

import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LogOut, LayoutDashboard, Users, FolderOpen, Package, ShoppingCart, TrendingDown } from "lucide-react";

export function ProtectedNav(): React.JSX.Element {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-14 items-center px-4">
          <span className="font-heading font-semibold text-lg">
            <span className="text-gradient-primary">Inventry</span>
          </span>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="font-heading font-semibold text-lg">
            <span className="text-gradient-primary">Inventry</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link
              href="/dashboard"
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
            >
              <LayoutDashboard className="size-4" />
              Dashboard
            </Link>
            <Link
              href="/categories"
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
            >
              <FolderOpen className="size-4" />
              Categories
            </Link>
            <Link
              href="/products"
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
            >
              <Package className="size-4" />
              Products
            </Link>
            <Link
              href="/orders"
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
            >
              <ShoppingCart className="size-4" />
              Orders
            </Link>
            <Link
              href="/restock"
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
            >
              <TrendingDown className="size-4" />
              Restock
            </Link>
            {user?.role === "admin" && (
              <Link
                href="/admin/users"
                className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
              >
                <Users className="size-4" />
                Users
              </Link>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            {user?.name} ({user?.role})
          </span>
          <Button variant="ghost" size="sm" onClick={logout}>
            <LogOut className="size-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
}
