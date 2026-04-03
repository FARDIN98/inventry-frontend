import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Package, BarChart3, ShieldCheck, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-14 items-center border-b px-6">
        <span className="font-semibold text-lg tracking-tight">Inventry</span>
        <nav className="ml-auto flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/auth">Sign In</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/auth">Get Started</Link>
          </Button>
        </nav>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4">
        <div className="text-center max-w-2xl mx-auto space-y-8">
          <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">
            Inventory, simplified.
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
            Smart inventory &amp; order management. Track stock, fulfill orders,
            and keep your business running smoothly.
          </p>

          <div className="flex items-center justify-center gap-4 pt-2">
            <Button asChild size="lg">
              <Link href="/auth">
                Get Started
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/auth">Sign In</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6 pt-12 sm:grid-cols-3">
            <div className="flex flex-col items-center gap-3 rounded-xl border bg-card p-6">
              <Package className="size-8 text-foreground" />
              <h3 className="font-semibold">Stock Tracking</h3>
              <p className="text-sm text-muted-foreground text-center">
                Real-time inventory levels with low-stock alerts
              </p>
            </div>
            <div className="flex flex-col items-center gap-3 rounded-xl border bg-card p-6">
              <BarChart3 className="size-8 text-foreground" />
              <h3 className="font-semibold">Order Management</h3>
              <p className="text-sm text-muted-foreground text-center">
                Automatic stock deduction and fulfillment tracking
              </p>
            </div>
            <div className="flex flex-col items-center gap-3 rounded-xl border bg-card p-6">
              <ShieldCheck className="size-8 text-foreground" />
              <h3 className="font-semibold">Role-Based Access</h3>
              <p className="text-sm text-muted-foreground text-center">
                Admin and manager roles with granular permissions
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
