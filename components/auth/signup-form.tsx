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

export function SignupForm(): React.JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [generalError, setGeneralError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

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
      await apiClient.post<AuthResponse>("/auth/signup", {
        email,
        password,
        name,
      });
      router.push(getSafeCallbackUrl());
    } catch (err) {
      const apiError = err as ApiErrorResponse;

      if (apiError.statusCode === 409) {
        // ConflictException — email already registered
        setErrors({ email: "Email already registered" });
      } else if (apiError.statusCode === 400 && Array.isArray(apiError.message)) {
        // NestJS class-validator returns array of messages
        const fieldErrors: FieldErrors = {};
        for (const msg of apiError.message) {
          const lowerMsg = msg.toLowerCase();
          if (lowerMsg.includes("name")) {
            fieldErrors.name = msg;
          } else if (lowerMsg.includes("email")) {
            fieldErrors.email = msg;
          } else if (lowerMsg.includes("password")) {
            fieldErrors.password = msg;
          } else {
            // Fallback for unrecognized field errors
            fieldErrors.general = msg;
          }
        }
        if (fieldErrors.general) {
          setGeneralError(fieldErrors.general);
          delete fieldErrors.general;
        }
        setErrors(fieldErrors);
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      {generalError && (
        <div className="text-sm text-destructive">{generalError}</div>
      )}

      <div className="space-y-1">
        <Label htmlFor="signup-name">Name</Label>
        <Input
          id="signup-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          required
          autoComplete="name"
        />
        {errors.name && (
          <p className="text-sm text-destructive mt-1">{errors.name}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="signup-email">Email</Label>
        <Input
          id="signup-email"
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
        <Label htmlFor="signup-password">Password</Label>
        <Input
          id="signup-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          autoComplete="new-password"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Min 8 characters, 1 uppercase letter, 1 number
        </p>
        {errors.password && (
          <p className="text-sm text-destructive mt-1">{errors.password}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creating..." : "Create Account"}
      </Button>
    </form>
  );
}
