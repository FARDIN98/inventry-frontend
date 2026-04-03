import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { LoginForm } from "@/components/auth/login-form";
import { SignupForm } from "@/components/auth/signup-form";

export default function AuthPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-primary/20 blur-[100px]" />
        <div className="absolute -bottom-32 -right-24 w-[600px] h-[400px] rounded-full bg-secondary/15 blur-[100px]" />
        <div className="absolute top-1/2 -left-32 w-[400px] h-[300px] rounded-full bg-primary/10 blur-[80px]" />
      </div>

      <Card className="w-full max-w-md shadow-gradient-lg border-0 ring-1 ring-white/20 bg-card/80 backdrop-blur-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold font-heading tracking-tight">
            <span className="text-gradient-primary">Inventry</span>
          </CardTitle>
          <CardDescription>Inventory &amp; Order Management</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <Suspense>
                <LoginForm />
              </Suspense>
            </TabsContent>
            <TabsContent value="signup">
              <Suspense>
                <SignupForm />
              </Suspense>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
