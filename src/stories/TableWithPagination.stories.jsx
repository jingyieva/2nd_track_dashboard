import { useState, useMemo, useEffect } from 'react';
import { MemoryRouter } from 'react-router-dom';
import CustomTable from '@/components/tables';
import CustomPagination from '@/components/paginations';
import { getPaginationRange } from '@/stories/utils';

const columns = [
  { key: 'id', name: 'ID', sortable: true, width: 'w-[80px]' },
  { key: 'date', name: 'Date', sortable: true },
  { key: 'platform', name: 'Platform' },
  { key: 'total', name: 'Total', align: 'right' },
  {
    key: 'operation',
    name: '操作',
    actions: [{ id: 'view', action: ({ data }) => alert(`查看 ${data.id}`) }],
  },
];

const allRows = Array.from({ length: 53 }).map((_, i) => ({
  id: i + 1,
  date: `2025-08-${String((i % 30) + 1).padStart(2, '0')}`,
  platform: ['Shopee', 'Carousell', 'Instagram'][i % 3],
  total: Math.floor(100 + Math.random() * 900),
}));

export default {
  title: 'Components/TableWithPagination',
};

export const Default = {
  render: () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sort, setSort] = useState({ key: null, dir: null });

    const totalPages = Math.max(1, Math.ceil(allRows.length / pageSize));

    const sortedRows = useMemo(() => {
      if (!sort.key) return allRows;
      return [...allRows].sort((a, b) => {
        const va = a[sort.key];
        const vb = b[sort.key];
        if (va === vb) return 0;
        if (sort.dir === 'asc') return va > vb ? 1 : -1;
        return va < vb ? 1 : -1;
      });
    }, [sort]);

    const pageRows = useMemo(() => {
      const start = (page - 1) * pageSize;
      return sortedRows.slice(start, start + pageSize);
    }, [page, pageSize, sortedRows]);

    const paginationRange = useMemo(
      () => getPaginationRange({ totalPages, currentPage: page }),
      [totalPages, page]
    );

    // 當 pageSize 改變時，校正頁碼以避免超出
    useEffect(() => {
      const newTotal = Math.max(1, Math.ceil(allRows.length / pageSize));
      if (page > newTotal) setPage(newTotal);
    }, [pageSize]); // eslint-disable-line

    return (
      <MemoryRouter>
        <div className="w-[960px] space-y-4">
          <CustomTable
            name="table-with-pagination"
            ariaLabel="Orders table"
            columns={columns}
            datas={pageRows}
            sort={sort}
            onSortChange={setSort}
            density="comfy"
          />
          <CustomPagination
            currentPage={page}
            totalPages={totalPages}
            paginationRange={paginationRange}
            switchPage={setPage}
            pageSize={pageSize}
            changePageSize={setPageSize}
          />
        </div>
      </MemoryRouter>
    );
  },
};
