// src/components/pagination/index.jsx

import { cn } from '@/lib/utils';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


export default function CustomPagination({ 
    currentPage = 1,
    totalPages,
    paginationRange,
    switchPage,
    pageSize,
    changePageSize,
}) {
    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage === totalPages;
    const handlePageClick = (page) => () => switchPage(page);

    return (
        <div className="m-3 flex items-center justify-between">
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious 
                            aria-disabled={isFirstPage}
                            aria-label="Go to previous page"
                            onClick={() => !isFirstPage && switchPage(currentPage - 1)} 
                            className={cn(
                                isFirstPage && "opacity-50 cursor-not-allowed hover:bg-transparent"
                            )}
                            disabled={isFirstPage}
                        />
                    </PaginationItem>
                    {

                        paginationRange.map((r, index) => (
                            <PaginationItem key={`page-${r}-${index}`}>
                            {
                                (r === 'ELLIPSIS') ? (
                                    <PaginationEllipsis aria-hidden="true"/>
                                ) : (
                                    <PaginationLink 
                                        aria-label={`Page ${r}`}
                                        aria-current={r === currentPage ? "page" : undefined}
                                        isActive={r === currentPage} 
                                        onClick={handlePageClick(r)}>{r}</PaginationLink>
                                )
                            }
                            </PaginationItem>
                        ))
                    }
                    <PaginationItem>
                        <PaginationNext 
                            aria-disabled={isLastPage}
                            aria-label="Go to next page"
                            onClick={() => !isLastPage && switchPage(currentPage + 1)}
                            className={cn(
                                isLastPage && "opacity-50 cursor-not-allowed hover:bg-transparent"
                            )}
                            disabled={isLastPage}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
            <Select 
                value={String(pageSize)}
                onValueChange={(e) => {
                    changePageSize(Number(e));
                }}
            >
                <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder={`${pageSize} 筆`} />
                </SelectTrigger>
                <SelectContent>
                    {[5, 10, 20, 50].map((size) => (
                        <SelectItem key={size} value={String(size)}>
                            {`${size}筆`}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
