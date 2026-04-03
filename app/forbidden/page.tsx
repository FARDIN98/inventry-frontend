import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

export default function ForbiddenPage(): React.JSX.Element {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <ShieldAlert className="size-16 text-destructive mb-4" />
      <h1 className="text-3xl font-bold mb-2">403 — Forbidden</h1>
      <p className="text-muted-foreground mb-6">
        You do not have permission to access this page.
      </p>
      <Button asChild>
        <Link href="/dashboard">Back to Dashboard</Link>
      </Button>
    </div>
  );
}
