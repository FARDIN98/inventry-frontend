"use client";

import * as React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";

interface ProductPaginationProps {
  currentPage: number;
  totalPages: number;
  currentLimit: number;
  basePath: string;
  searchParams: Record<string, string>;
}

function buildUrl(
  basePath: string,
  searchParams: Record<string, string>,
  overrides: Record<string, string>
): string {
  const params = new URLSearchParams(searchParams);
  Object.entries(overrides).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
  });
  return `${basePath}?${params.toString()}`;
}

function getPageNumbers(
  currentPage: number,
  totalPages: number
): (number | "ellipsis")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | "ellipsis")[] = [1];

  if (currentPage > 3) {
    pages.push("ellipsis");
  }

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (currentPage < totalPages - 2) {
    pages.push("ellipsis");
  }

  pages.push(totalPages);

  return pages;
}

export function ProductPagination({
  currentPage,
  totalPages,
  currentLimit,
  basePath,
  searchParams,
}: ProductPaginationProps): React.JSX.Element {
  const router = useRouter();
  const urlSearchParams = useSearchParams();

  const handleLimitChange = (value: string) => {
    const params = new URLSearchParams(urlSearchParams.toString());
    params.set("limit", value);
    params.set("page", "1");
    router.push(`${basePath}?${params.toString()}`);
  };

  const pageNumbers = getPageNumbers(currentPage, totalPages);

  const prevUrl =
    currentPage > 1
      ? buildUrl(basePath, searchParams, { page: String(currentPage - 1) })
      : undefined;

  const nextUrl =
    currentPage < totalPages
      ? buildUrl(basePath, searchParams, { page: String(currentPage + 1) })
      : undefined;

  if (totalPages <= 1 && currentLimit === 10) {
    return <></>;
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Per page</span>
        <Select value={String(currentLimit)} onValueChange={handleLimitChange}>
          <SelectTrigger className="w-[70px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="25">25</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {totalPages > 1 && (
        <Pagination className="mx-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              {prevUrl ? (
                <PaginationPrevious href={prevUrl} />
              ) : (
                <PaginationPrevious
                  href="#"
                  aria-disabled="true"
                  className="pointer-events-none opacity-50"
                />
              )}
            </PaginationItem>

            {pageNumbers.map((page, index) => (
              <PaginationItem key={index}>
                {page === "ellipsis" ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    href={buildUrl(basePath, searchParams, {
                      page: String(page),
                    })}
                    isActive={page === currentPage}
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              {nextUrl ? (
                <PaginationNext href={nextUrl} />
              ) : (
                <PaginationNext
                  href="#"
                  aria-disabled="true"
                  className="pointer-events-none opacity-50"
                />
              )}
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
