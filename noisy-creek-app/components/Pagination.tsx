'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalResults: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export default function Pagination({ 
  currentPage, 
  totalResults, 
  hasNext, 
  hasPrevious 
}: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pageSize = 9; // Should match your Django pagination
  const totalPages = Math.ceil(totalResults / pageSize);

  const updatePage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    if (page <= 1) {
      params.delete('page');
    } else {
      params.set('page', page.toString());
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  // Don't show pagination if there's only one page
  if (totalPages <= 1) {
    return null;
  }

  // Calculate page range to show
  const getPageRange = () => {
    const delta = 2; // Show 2 pages before and after current
    const range = [];
    const start = Math.max(1, currentPage - delta);
    const end = Math.min(totalPages, currentPage + delta);

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    return range;
  };

  const pageRange = getPageRange();

  return (
    <div className="flex justify-center items-center gap-4 mt-8">
      <div className="bg-green-800/80 rounded-lg p-4 border-4 border-green-600">
        <div className="flex items-center gap-2">
          {/* Previous Button */}
          <button
            onClick={() => updatePage(currentPage - 1)}
            disabled={!hasPrevious}
            className={`flex items-center gap-1 px-3 py-2 rounded font-semibold transition-colors ${
              hasPrevious
                ? 'bg-yellow-300 text-green-800 hover:bg-yellow-400'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Prev
          </button>

          {/* Page Numbers */}
          <div className="flex gap-1">
            {/* First page if not in range */}
            {pageRange[0] > 1 && (
              <>
                <button
                  onClick={() => updatePage(1)}
                  className="px-3 py-2 rounded font-semibold bg-green-700 text-white hover:bg-green-600 transition-colors"
                >
                  1
                </button>
                {pageRange[0] > 2 && (
                  <span className="px-3 py-2 text-white">...</span>
                )}
              </>
            )}

            {/* Page range */}
            {pageRange.map((page) => (
              <button
                key={page}
                onClick={() => updatePage(page)}
                className={`px-3 py-2 rounded font-semibold transition-colors ${
                  page === currentPage
                    ? 'bg-yellow-300 text-green-800'
                    : 'bg-green-700 text-white hover:bg-green-600'
                }`}
              >
                {page}
              </button>
            ))}

            {/* Last page if not in range */}
            {pageRange[pageRange.length - 1] < totalPages && (
              <>
                {pageRange[pageRange.length - 1] < totalPages - 1 && (
                  <span className="px-3 py-2 text-white">...</span>
                )}
                <button
                  onClick={() => updatePage(totalPages)}
                  className="px-3 py-2 rounded font-semibold bg-green-700 text-white hover:bg-green-600 transition-colors"
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>

          {/* Next Button */}
          <button
            onClick={() => updatePage(currentPage + 1)}
            disabled={!hasNext}
            className={`flex items-center gap-1 px-3 py-2 rounded font-semibold transition-colors ${
              hasNext
                ? 'bg-yellow-300 text-green-800 hover:bg-yellow-400'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        
        {/* Results info */}
        <div className="text-center text-white text-sm mt-2">
          Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalResults)} of {totalResults} events
        </div>
      </div>
    </div>
  );
}