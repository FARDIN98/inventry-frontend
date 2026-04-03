"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/lib/api-client";
import type {
  AuthResponse,
  FieldErrors,
  ApiErrorResponse,
} from "@/lib/auth-types";

export function LoginForm(): React.JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [generalError, setGeneralError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [demoLoading, setDemoLoading] = useState<boolean>(false);

  function getSafeCallbackUrl(): string {
    const callbackUrl = searchParams.get("callbackUrl");
    if (callbackUrl && callbackUrl.startsWith("/")) {
      return callbackUrl;
    }
    return "/dashboard";
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    e.preventDefault();
    setErrors({});
    setGeneralError("");
    setLoading(true);

    try {
      await apiClient.post<AuthResponse>("/auth/login", { email, password });
      router.push(getSafeCallbackUrl());
    } catch (err) {
      const apiError = err as ApiErrorResponse;
      if (apiError.statusCode === 400 && Array.isArray(apiError.message)) {
        const fieldErrors: FieldErrors = {};
        for (const msg of apiError.message) {
          if (msg.toLowerCase().includes("email")) {
            fieldErrors.email = msg;
          } else if (msg.toLowerCase().includes("password")) {
            fieldErrors.password = msg;
          }
        }
        setErrors(fieldErrors);
      } else if (apiError.statusCode === 401) {
        setGeneralError("Invalid email or password");
      } else {
        setGeneralError(
          typeof apiError.message === "string"
            ? apiError.message
            : "An error occurred. Please try again."
        );
      }
      setLoading(false);
    }
  }

  async function handleDemoLogin(): Promise<void> {
    setErrors({});
    setGeneralError("");
    setDemoLoading(true);

    try {
      await apiClient.post<AuthResponse>("/auth/demo-login");
      router.push(getSafeCallbackUrl());
    } catch (err) {
      const apiError = err as ApiErrorResponse;
      setGeneralError(
        typeof apiError.message === "string"
          ? apiError.message
          : "Demo login failed. Please try again."
      );
      setDemoLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      {generalError && (
        <div className="text-sm text-destructive">{generalError}</div>
      )}

      <div className="space-y-1">
        <Label htmlFor="login-email">Email</Label>
        <Input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          autoComplete="email"
        />
        {errors.email && (
          <p className="text-sm text-destructive mt-1">{errors.email}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="login-password">Password</Label>
        <Input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          autoComplete="current-password"
        />
        {errors.password && (
          <p className="text-sm text-destructive mt-1">{errors.password}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Signing in..." : "Sign In"}
      </Button>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or</span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleDemoLogin}
        disabled={demoLoading}
      >
        {demoLoading ? "Loading..." : "Demo Login"}
      </Button>
    </form>
  );
}
