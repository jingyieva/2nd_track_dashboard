// src/pages/__tests__/Orders.select.test.jsx
import { screen, within, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithRouter } from '../utils';
import { waitTableIdle, getRows} from '../helpers';

// 啟用手動 mock（會自動讀 __mocks__ 下的檔案）
jest.mock('@/components/ui/select')

import Orders from '@/pages/Orders'  // 正常匯入，不需要 isolateModules

it('filters by platform and can reset to "全部平台"', async () => {
    const user = userEvent.setup()

    renderWithRouter(<Orders />)
    await waitTableIdle();
    const before = getRows().length
    expect(before).toBeGreaterThan(0)

    // 點選「蝦皮」
    await user.click(screen.getByTestId('select-item-蝦皮'))

    await waitFor(() => {
        const rows = getRows()
        expect(rows.length).toBeLessThanOrEqual(before)
        rows.forEach((row) => {
            expect(within(row).getByText('蝦皮')).toBeInTheDocument()
        })
    })

    // 點回「全部平台」（value="__ALL__" -> 你的頁面會轉空字串）
    await user.click(screen.getByTestId('select-item-__ALL__'))
    // 等待恢復
    await waitFor(() => {
        const rows = getRows()
        expect(rows.length).toBe(before)
    })
})