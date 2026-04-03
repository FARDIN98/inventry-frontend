import { AuthProvider } from "@/lib/auth-context";
import { ProtectedNav } from "@/components/layout/protected-nav";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.JSX.Element {
  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col">
        <ProtectedNav />
        <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
      </div>
    </AuthProvider>
  );
}
