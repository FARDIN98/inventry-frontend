import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Package, BarChart3, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 flex-col items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 -left-24 size-[500px] rounded-full bg-primary/15 blur-[100px]" />
          <div className="absolute bottom-1/4 -right-24 size-[400px] rounded-full bg-secondary/15 blur-[100px]" />
        </div>

        <div className="text-center max-w-2xl mx-auto space-y-8">
          <h1 className="text-5xl font-bold tracking-tight font-heading sm:text-6xl">
            <span className="text-gradient-primary">Inventry</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
            Smart inventory &amp; order management. Track stock, fulfill orders,
            and keep your business running smoothly.
          </p>

          <div className="flex items-center justify-center gap-4 pt-2">
            <Button asChild size="lg">
              <Link href="/auth">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/auth">Sign In</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6 pt-12 sm:grid-cols-3">
            <div className="flex flex-col items-center gap-3 rounded-xl border bg-card/60 p-6 backdrop-blur-sm">
              <Package className="size-8 text-primary" />
              <h3 className="font-heading font-semibold">Stock Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Real-time inventory levels with low-stock alerts
              </p>
            </div>
            <div className="flex flex-col items-center gap-3 rounded-xl border bg-card/60 p-6 backdrop-blur-sm">
              <BarChart3 className="size-8 text-secondary" />
              <h3 className="font-heading font-semibold">Order Management</h3>
              <p className="text-sm text-muted-foreground">
                Automatic stock deduction and fulfillment tracking
              </p>
            </div>
            <div className="flex flex-col items-center gap-3 rounded-xl border bg-card/60 p-6 backdrop-blur-sm">
              <ShieldCheck className="size-8 text-primary" />
              <h3 className="font-heading font-semibold">Role-Based Access</h3>
              <p className="text-sm text-muted-foreground">
                Admin and manager roles with granular permissions
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
