import React from 'react';
import { DashboardContent } from '@/components/dashboard/dashboard-content';

export default function DashboardPage(): React.JSX.Element {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-heading tracking-tight">
          <span className="text-gradient-primary">Dashboard</span>
        </h1>
        <p className="text-muted-foreground mt-1">
          Welcome to Inventry. Your inventory overview at a glance.
        </p>
      </div>

      <DashboardContent />
    </div>
  );
}
