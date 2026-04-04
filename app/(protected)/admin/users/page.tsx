"use client";

import React, { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/api-client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Users, ShieldCheck, Search, RefreshCw, Loader2 } from "lucide-react";

interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "manager";
  created_at: string;
}

interface ApiUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "manager";
  created_at: string;
}

function RoleBadge({ role }: { role: string }): React.JSX.Element {
  if (role === "admin") {
    return (
      <Badge className="bg-primary/20 text-primary border-none font-medium">
        <ShieldCheck className="h-3 w-3 mr-1" />
        Admin
      </Badge>
    );
  }
  return (
    <Badge className="bg-muted/40 text-muted-foreground border-none font-medium">
      Manager
    </Badge>
  );
}

export default function AdminUsersPage(): React.JSX.Element {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  // Role change dialog state
  const [pendingRoleChange, setPendingRoleChange] = useState<{
    user: User;
    newRole: "admin" | "manager";
  } | null>(null);
  const [isChangingRole, setIsChangingRole] = useState<boolean>(false);

  const fetchUsers = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiClient.get<{ users: ApiUser[] }>("/auth/admin/users");
      setUsers(data.users);
    } catch (e: unknown) {
      const err = e as { message?: string };
      if (err?.message?.includes("Forbidden") || err?.message?.includes("403")) {
        setError("You don't have permission to view this page. Admin role required.");
      } else {
        setError("Failed to load users. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  const confirmRoleChange = async (): Promise<void> => {
    if (!pendingRoleChange) return;
    setIsChangingRole(true);
    try {
      await apiClient.patch(`/auth/admin/users/${pendingRoleChange.user.id}/role`, {
        role: pendingRoleChange.newRole,
      });
      setUsers((prev) =>
        prev.map((u) =>
          u.id === pendingRoleChange.user.id
            ? { ...u, role: pendingRoleChange.newRole }
            : u
        )
      );
    } catch {
      setError("Failed to update role. Please try again.");
    } finally {
      setIsChangingRole(false);
      setPendingRoleChange(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      search === "" ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">User Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage system users and role assignments
          <span className="ml-2 inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
            <ShieldCheck className="h-3 w-3" /> Admin only
          </span>
        </p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
            <Users className="h-4 w-4" />
            Total Users
          </div>
          <p className="text-2xl font-bold">{users.length}</p>
        </div>
        <div className="border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
            <ShieldCheck className="h-4 w-4" />
            Admins
          </div>
          <p className="text-2xl font-bold">
            {users.filter((u) => u.role === "admin").length}
          </p>
        </div>
        <div className="border border-border rounded-xl p-4 hidden sm:block">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
            <Users className="h-4 w-4" />
            Managers
          </div>
          <p className="text-2xl font-bold">
            {users.filter((u) => u.role === "manager").length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            id="user-search"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-40" id="role-filter">
            <SelectValue placeholder="All roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="icon"
          className="shrink-0"
          onClick={() => void fetchUsers()}
          title="Refresh"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Change Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-12 text-muted-foreground"
                >
                  {search || roleFilter !== "all"
                    ? "No users match your filters"
                    : "No users found"}
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-muted/20">
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <RoleBadge role={user.role} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(user.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Select
                      value={user.role}
                      onValueChange={(newRole: string) =>
                        setPendingRoleChange({
                          user,
                          newRole: newRole as "admin" | "manager",
                        })
                      }
                    >
                      <SelectTrigger className="w-32 ml-auto text-xs" id={`role-${user.id}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Role change confirmation dialog */}
      <AlertDialog
        open={!!pendingRoleChange}
        onOpenChange={(open) => {
          if (!open) setPendingRoleChange(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change User Role</AlertDialogTitle>
            <AlertDialogDescription>
              Change <strong>{pendingRoleChange?.user.name}</strong>&apos;s role from{" "}
              <strong>{pendingRoleChange?.user.role}</strong> to{" "}
              <strong>{pendingRoleChange?.newRole}</strong>?
              {pendingRoleChange?.newRole === "admin" && (
                <span className="block mt-2 text-warning">
                  ⚠ This will grant full admin privileges.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isChangingRole}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => void confirmRoleChange()}
              disabled={isChangingRole}
            >
              {isChangingRole ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
