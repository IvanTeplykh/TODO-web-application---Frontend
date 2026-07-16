"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./Button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <Button
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </Button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Showing Page <span className="font-semibold text-slate-700 dark:text-slate-200">{currentPage}</span> of{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-200">{totalPages}</span>
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md gap-1"
            aria-label="Pagination"
          >
            <Button
              variant="outline"
              size="sm"
              icon={<ChevronLeft className="h-4 w-4" />}
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
            />
            {Array.from({ length: totalPages }).map((_, index) => {
              const pageNum = index + 1;
              const isSelected = pageNum === currentPage;
              return (
                <Button
                  key={pageNum}
                  variant={isSelected ? "primary" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              icon={<ChevronRight className="h-4 w-4" />}
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
            />
          </nav>
        </div>
      </div>
    </div>
  );
}
