"use client";

import React from "react";
import { AlertCircle, X } from "lucide-react";

interface StockWarningAlertProps {
  message: string;
  onDismiss: () => void;
}

export function StockWarningAlert({
  message,
  onDismiss,
}: StockWarningAlertProps): React.JSX.Element {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4"
    >
      <AlertCircle className="size-5 text-destructive mt-0.5 shrink-0" />
      <div className="flex-1">
        <p className="text-sm text-destructive font-medium">Stock Error</p>
        <p className="text-sm text-destructive/90 mt-0.5">{message}</p>
      </div>
      <button
        onClick={onDismiss}
        aria-label="Dismiss"
        className="text-destructive/60 hover:text-destructive transition-colors"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
