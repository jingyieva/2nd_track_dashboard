import { useState, useMemo } from "react";

import CustomTable from "@/components/tables";
import { MemoryRouter } from 'react-router-dom'

const columns = [
  { key: 'id', name: 'ID', sortable: true },
  { key: 'name', name: 'Name', sortable: true },
  { key: 'price', name: 'Price', align: 'right' },
  { key: 'operation', name: '操作', actions: [
      { id: 'view', action: ({ data }) => alert(`查看 ${data.name}`) }
    ]
  },
];

const datas = [
  { id: 1, name: 'Product A', price: 100 },
  { id: 2, name: 'Product B', price: 200 },
  { id: 3, name: 'Product C', price: 300 },
];

const TableWithRouter = (args) => (
    <MemoryRouter>
        <CustomTable {...args} />
    </MemoryRouter>
)

export default {
  title: 'Components/CustomTable',
  component: TableWithRouter,
};

export const Default = {
  render: () => (
    <div className="w-[720px]">
      <TableWithRouter
        name="demo"
        ariaLabel="Demo table"
        columns={columns}
        datas={datas}
      />
    </div>
  ),
};

export const Loading = {
  render: () => (
    <div className="w-[720px]">
      <TableWithRouter
        name="loading"
        ariaLabel="Loading table"
        columns={columns}
        datas={[]}
        isLoading
      />
    </div>
  ),
};

export const Error = {
  render: () => (
    <div className="w-[720px]">
      <TableWithRouter
        name="error"
        ariaLabel="Error table"
        columns={columns}
        datas={[]}
        error="Network error"
        onRetry={() => alert('retry clicked')}
      />
    </div>
  ),
};

export const Empty = {
  render: () => (
    <div className="w-[720px]">
      <TableWithRouter
        name="empty"
        ariaLabel="Empty table"
        columns={columns}
        datas={[]}
        onClearFilters={() => alert('clear filters')}
      />
    </div>
  ),
};

export const Sortable = {
  render: () => {
    const [sort, setSort] = useState({ key: null, dir: null });

    const sortedData = useMemo(() => {
      if (!sort.key) return datas;
      return [...datas].sort((a, b) => {
        if (sort.dir === 'asc') return a[sort.key] > b[sort.key] ? 1 : -1;
        if (sort.dir === 'desc') return a[sort.key] < b[sort.key] ? 1 : -1;
        return 0;
      });
    }, [sort]);

    return (
      <div className="w-[720px]">
        <TableWithRouter
          name="sortable"
          ariaLabel="Sortable table"
          columns={columns}
          datas={sortedData}
          sort={sort}
          onSortChange={setSort}
        />
      </div>
    );
  },
};