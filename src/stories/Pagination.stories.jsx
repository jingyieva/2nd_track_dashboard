import { useState, useMemo, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CustomPagination from '@/components/paginations';

import { getPaginationRange } from '@/stories/utils';

export default {
  title: 'Components/Pagination',
  component: CustomPagination,
  args: {
    currentPage: 1,
    totalPages: 10,
    pageSize: 10,
  },
  argTypes: {
    currentPage: { control: 'number' },
    totalPages: { control: 'number' },
    pageSize: { control: 'number' },
  },
};

export const Basic = {
  render: (args) => {
    const [page, setPage] = useState(args.currentPage);
    const [size, setSize] = useState(args.pageSize);
    const range = useMemo(
        () => getPaginationRange({ totalPages: args.totalPages, currentPage: page }),
        [args.totalPages, page]
    );

    return (
      <div className="space-y-2">
        <CustomPagination
          currentPage={page}
          totalPages={args.totalPages}
          paginationRange={range}
          switchPage={setPage}
          pageSize={size}
          changePageSize={setSize}
        />
        <p className="text-sm opacity-70">
          Current page: {page} / {args.totalPages} • Page size: {size}
        </p>
      </div>
    );
  },
};

export const FewPages = {
  args: { totalPages: 4 },
  render: Basic.render,
};

export const ManyPages = {
  args: { totalPages: 42 },
  render: Basic.render,
};

export const LastPage = {
  args: { currentPage: 10, totalPages: 10 },
  render: Basic.render,
};

export const ControlSiblingsAndBoundary = {
  render: (args) => {
    const [page, setPage] = useState(args.currentPage);
    const [size, setSize] = useState(args.pageSize);
    const [totalPages, setTotalPages] = useState(10);
    const [siblingCount, setSiblingCount] = useState(1);
    const [boundaryCount, setBoundaryCount] = useState(1);
    
    const safe = (v, min = 0, max = Infinity) =>
        Math.min(Math.max(min, Number.isFinite(+v) ? Math.floor(+v) : 0), max);

    // 防呆：確保為 >=0 的整數，且不要超過 totalPages
    const safeTotal = Math.max(1, safe(totalPages, 1));
    const safeSibling = safe(siblingCount, 0, safeTotal);
    const safeBoundary = safe(boundaryCount, 0, safeTotal);
    const safePage = safe(page, 1, safeTotal, 1);

    // total 或 pageSize 變動時，避免 page 超出
    useEffect(() => {
      if (page !== safePage) setPage(safePage);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [safeTotal, size]);


    const range = useMemo(
      () => getPaginationRange({ 
        totalPages: safeTotal, 
        currentPage: safePage, 
        siblingCount: safeSibling, boundaryCount: safeBoundary  }),
      [safeTotal, safePage, safeSibling, safeBoundary]
    );

    return (
        <>
            <div className="flex justify-center space-x-3 mb-6">
                <div className="grid w-[200px] gap-2">
                    <Label htmlFor="totalPages">Total Pages</Label>
                    <Input
                        id="totalPages"
                        type="number"
                        placeholder="Total Pages"
                        value={totalPages}
                        min={1}
                        onChange={(e) => setTotalPages(e.target.value)}
                    />
                </div>
                <div className="grid w-[200px] gap-2">
                    <Label htmlFor="siblingCount">Sibling</Label>
                    <Input
                        id="siblingCount"
                        type="number"
                        placeholder="Sibling Count"
                        value={siblingCount}
                        min={0}
                        max={totalPages}
                        onChange={(e) => setSiblingCount(e.target.value)}
                    />
                </div>
                <div className="grid w-[200px] gap-2">
                    <Label htmlFor="boundaryCount">Boundary</Label>
                    <Input
                        id="boundaryCount"
                        type="number"
                        placeholder="Boundary Count"
                        value={boundaryCount}
                        min={0}
                        max={totalPages}
                        onChange={(e) => setBoundaryCount(e.target.value)}
                    />
                </div>
            </div>
            <hr />
            <div className="space-y-2">
                <CustomPagination
                currentPage={safePage}
                totalPages={safeTotal}
                paginationRange={range}
                switchPage={setPage}
                pageSize={size}
                changePageSize={setSize}
                />
                <p className="text-sm opacity-70">
                    Current page: {safePage} / {safeTotal} • Page size: {size}
                </p>
            </div>
        </>
    );
  },
};
