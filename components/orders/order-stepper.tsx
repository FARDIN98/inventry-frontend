import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/lib/order-types";

interface OrderStepperProps {
  currentStatus: OrderStatus;
}

const STEPS: Array<{ key: OrderStatus; label: string }> = [
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
];

export function OrderStepper({ currentStatus }: OrderStepperProps): React.JSX.Element {
  const stepIndex = STEPS.findIndex((s) => s.key === currentStatus);
  // If cancelled, stepIndex = -1 (all steps appear as inactive/grey)

  return (
    <div>
      <ol role="list" className="flex items-center w-full">
        {STEPS.map((step, index) => {
          const isCompleted = stepIndex > index;
          const isActive = stepIndex === index && currentStatus !== "cancelled";
          const isCancelled = currentStatus === "cancelled";

          return (
            <li key={step.key} className="flex-1 flex items-center">
              {/* Step circle */}
              <div
                aria-current={isActive ? "step" : undefined}
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold shrink-0",
                  isCompleted && !isCancelled
                    ? "bg-success text-white"
                    : "",
                  isActive ? "bg-gradient-primary text-white" : "",
                  !isCompleted && !isActive
                    ? "bg-muted text-muted-foreground"
                    : "",
                  isCancelled ? "bg-muted text-muted-foreground" : "",
                )}
              >
                {isCompleted && !isCancelled ? (
                  <Check className="size-4" />
                ) : (
                  index + 1
                )}
              </div>
              {/* Step label */}
              <span
                className={cn(
                  "ml-2 text-sm font-medium",
                  isActive ? "text-foreground" : "text-muted-foreground",
                  isCompleted && !isCancelled ? "text-success" : "",
                )}
              >
                {step.label}
              </span>
              {/* Connector line (not on last item) */}
              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-3",
                    isCompleted && !isCancelled ? "bg-success" : "bg-border",
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
      {currentStatus === "cancelled" && (
        <div className="mt-3 flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-destructive/15 text-destructive text-xs font-medium px-2.5 py-0.5">
            Order Cancelled
          </span>
          <span className="text-xs text-muted-foreground">
            This order has been cancelled and stock has been restored.
          </span>
        </div>
      )}
    </div>
  );
}
