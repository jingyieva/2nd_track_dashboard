import { screen, renderHook, render } from "@testing-library/react"; 
import userEvent from "@testing-library/user-event"; 
import { useTableData } from '@/hooks/useTableData'
import { renderWithRouter } from '../utils'
import Table from '@/components/tables'

const COLUMNS = [
  { key: 'order_id', name: '訂單編號', sortable: true },
  { key: 'platform', name: '平台' },
  { key: 'revenue', name: '淨收入', sortable: true },
  { key: 'order_date', name: '日期', sortable: true,
    sortFn: (a,b,dir)=> (new Date(a.order_date)-new Date(b.order_date))*(dir==='asc'?1:-1)
  },
]
const DATA = [
  { order_id: 'A1', platform: '蝦皮', revenue: 100, order_date: '2025-07-16' },
  { order_id: 'B2', platform: '旋轉', revenue: -50, order_date: '2025-07-20' },
  { order_id: 'C3', platform: '蝦皮', revenue: 300, order_date: '2025-07-15' },
];

describe('useTableData Hook', () => {
  it('quick keyword filter narrows results and clears back', () => {
    const { result, rerender } = renderHook(
      ({ kw }) =>
        useTableData({ data: DATA, columns: COLUMNS, filters: { keyword: kw }, sort: null }),
      { initialProps: { kw: '' } }
    );

    expect(result.current.total).toBe(3);

    rerender({ kw: 'B2' });
    expect(result.current.total).toBe(1);
    expect(result.current.rows[0].order_id).toBe('B2');

    rerender({ kw: '' });
    expect(result.current.total).toBe(3);
  });

  it('select filter (platform) works', () => {
    const { result } = renderHook(() =>
      useTableData({
        data: DATA,
        columns: COLUMNS,
        filters: { selects: { platform: '蝦皮' } },
        sort: null,
      })
    );
    expect(result.current.total).toBe(2);
    expect(result.current.rows.map((r) => r.order_id)).toEqual(['A1', 'C3']);
  });

  it('range filter on revenue works', () => {
    const { result } = renderHook(() =>
      useTableData({
        data: DATA,
        columns: COLUMNS,
        filters: { ranges: { revenue: { min: 0, max: 200 } } },
        sort: null,
      })
    );
    expect(result.current.rows.map((r) => r.order_id)).toEqual(['A1']);
  });

  it('sorts by revenue asc/desc', () => {
    const asc = renderHook(() =>
      useTableData({ data: DATA, columns: COLUMNS, filters: {}, sort: { key: 'revenue', dir: 'asc' } })
    );
    expect(asc.result.current.rows.map((r) => r.revenue)).toEqual([-50, 100, 300]);

    const desc = renderHook(() =>
      useTableData({ data: DATA, columns: COLUMNS, filters: {}, sort: { key: 'revenue', dir: 'desc' } })
    );
    expect(desc.result.current.rows.map((r) => r.revenue)).toEqual([300, 100, -50]);
  });

  it('uses custom date sortFn', () => {
    const { result } = renderHook(() =>
      useTableData({ data: DATA, columns: COLUMNS, filters: {}, sort: { key: 'order_date', dir: 'asc' } })
    );
    expect(result.current.rows.map((r) => r.order_date)).toEqual([
      '2025-07-15',
      '2025-07-16',
      '2025-07-20',
    ]);
  });
});


describe('CustomTable states', () => {
  it('renders empty message', () => {
    renderWithRouter(<Table name="t" columns={COLUMNS} datas={[]} emptyDataMsg="No order found." />);
    expect(screen.getByText(/No order found/i)).toBeInTheDocument();
  });

  it('renders loading skeleton when isLoading', () => {
    // 在 Table 組件加入一個 data-testid="table-skeleton" 以利測試
    renderWithRouter(<Table name="t" columns={COLUMNS} datas={[]} isLoading />);
    const table = screen.getByTestId("t-table");
    expect(table).toHaveAttribute('aria-busy', 'true');

  });

  it('renders error with retry button', async () => {
    const onRetry = jest.fn();
    const user = userEvent.setup();

    renderWithRouter(<Table name="t" columns={COLUMNS} datas={[]} error="Oops" onRetry={onRetry} />);
    const btn = screen.getByRole('button', { name: /重試|重新整理|retry/i });
    await user.click(btn);
    expect(onRetry).toHaveBeenCalled();
  });
});