// tests/helpers.js
import { screen, within, waitFor } from '@testing-library/react';

export const getTable = () =>
  screen.getByTestId("order-table");

export const waitTableIdle = async () => {
  const table = getTable();
  await waitFor(() => expect(table).toHaveAttribute('aria-busy', 'false'));
  return table;
};

export const getRows = () => {
  const table = getTable();
  const allRows = within(table).getAllByRole('row').slice(1); // 去掉表頭
  // 過濾掉 skeleton / 空狀態列：只保留包含 data cell 的列
  return allRows.filter(
    (row) => {
        const hasSkeleton = row.querySelector('.animate-pulse');
        const hasAnyTd = row.querySelector('td');                 // 至少要有一個 cell
        return !hasSkeleton && hasAnyTd;
    }
  );
};