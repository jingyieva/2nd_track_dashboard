import userEvent from '@testing-library/user-event';
import { screen, within, waitFor, fireEvent } from '@testing-library/react';
import { renderWithRouter } from '../utils';
import Orders from '@/pages/Orders';

const getTableBodyRows = () => screen.getAllByRole('row').slice(1); // 跳過表頭

describe('Orders page', () => {
    let user;
    beforeEach(() => {
        user = userEvent.setup({
            // 避免 jsdom 因為沒有實體 layout 而誤判「不可點」
            pointerEventsCheck: 0,
        });
        renderWithRouter(<Orders />);
    });

    it('quick search narrows and clears to full', async () => {
        const input = screen.getByPlaceholderText(/搜尋訂單編號|搜尋訂單編號\/平台\/金額/i);
        const total = getTableBodyRows().length;

        await user.clear(input);
        await user.type(input, '20250716');
        expect(getTableBodyRows().length).toBeLessThan(total);

        await user.clear(input);
        expect(getTableBodyRows().length).toBe(total);
    });

    it('advanced revenue range (number inputs) filters results', async () => {
        const rowsOld = getTableBodyRows();
        const rowsOldLen = rowsOld.length;

        const btn = screen.getByRole('button', { name: /進階篩選/i });
        await user.click(btn);

        // 取 Popover 裡的兩個 number input（min / max）
        const spinbuttons = screen.getAllByRole('spinbutton');
        const [minInput, maxInput] = spinbuttons;

        fireEvent.change(minInput, { target: { value: '100' } })
        fireEvent.blur(minInput)
        fireEvent.change(maxInput, { target: { value: '250' } })
        fireEvent.blur(maxInput)

        // 關閉 Popover（按 Esc）
        await user.keyboard('{Escape}');

        // 驗證每列淨收入在 100~200
        await waitFor(() => {
            const curRows = getTableBodyRows();
            const curRowsLen = curRows.length;

            expect(rowsOldLen).not.toBe(curRowsLen)
    
            curRows.forEach((row) => {
                const numEl = within(row).getByTestId('revenue');
                const n = Number(numEl.textContent.replaceAll(',', ''));
                expect(n).toBeGreaterThanOrEqual(100);
                expect(n).toBeLessThanOrEqual(250);
            });
        })
    });

    it('sortable header toggles direction and persists across pagination', async () => {
        const th = screen.getByRole('columnheader', { name: /訂單編號/i });
        await user.click(th);

        const first1 = within(getTableBodyRows()[0]).getAllByRole('cell')[0].textContent?.trim()

        await user.click(th)

        const first2 = within(getTableBodyRows()[0]).getAllByRole('cell')[0].textContent?.trim()
        expect(first2).not.toBe(first1)


        const next = screen.getByLabelText("Go to next page");
        await user.click(next);
        const prev = screen.getByLabelText("Go to previous page");
        await user.click(prev);

        const first3 = within(getTableBodyRows()[0]).getAllByRole('cell')[0].textContent?.trim()
        expect(first3).toBe(first2);
    });

    it('empty state when no match', async () => {
        const input = screen.getByPlaceholderText(/搜尋訂單編號|搜尋訂單編號\/平台\/金額/i);
        await userEvent.clear(input);
        await userEvent.type(input, 'NO_MATCH_XXXXX');

        expect(screen.getByText(/No order found/i)).toBeInTheDocument();
    });
});
