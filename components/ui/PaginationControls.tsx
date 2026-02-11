// Pagination Controls Component

'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (items: number) => void;
}

const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50, 100];

export default function PaginationControls({
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    onPageChange,
    onItemsPerPageChange,
}: PaginationControlsProps) {
    if (totalItems === 0) return null;

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div className="flex items-center justify-end gap-5 py-4 text-sm text-gray-500 border-t border-base-200 mt-4 flex-wrap sm:justify-between">
            <div className="flex items-center gap-2 order-1 sm:order-none">
                <span className="whitespace-nowrap">Rows per page:</span>
                <select
                    className="select select-bordered select-xs w-full max-w-xs font-medium cursor-pointer"
                    value={itemsPerPage}
                    onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                >
                    {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>

            <div className="whitespace-nowrap order-2 sm:order-none">
                {startItem}-{endItem} of {totalItems}
            </div>

            <div className="flex items-center gap-2 order-3 ml-auto sm:ml-0">
                <button
                    className="btn btn-sm btn-circle btn-ghost"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                >
                    <ChevronLeft size={20} />
                </button>
                <button
                    className="btn btn-sm btn-circle btn-ghost"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label="Next page"
                >
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
}

