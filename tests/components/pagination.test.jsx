// tests/components/pagination.test.jsx 
import React from "react"; 
import { render, screen, renderHook, act } from "@testing-library/react"; 
import userEvent from "@testing-library/user-event"; 
import CustomPagination from "@/components/paginations"; 
import { usePagination } from "@/hooks/usePagination";


describe("usePagination Hook", () => {
    const mockData = Array.from({ length: 30 }, (_, i) =>  `Item ${ i + 1}`);
    it("should return default values correctly", () => {
        const { result } = renderHook(() =>
            usePagination({ datas: mockData, totalCount: mockData.length })
        );
        expect(result.current.currentPage).toBe(1);
        expect(result.current.pageSize).toBe(10);
        expect(result.current.totalPages).toBe(3);
    });

    it("should change page correctly and prevent invalid page numbers", () => {
        const { result } = renderHook(() =>
            usePagination({ datas: mockData, totalCount: mockData.length })
        );

        act(() => result.current.switchPage(2));
        expect(result.current.currentPage).toBe(2);

        act(() => result.current.switchPage(999)); // 超過範圍
        expect(result.current.currentPage).toBe(3);

        act(() => result.current.switchPage(-5)); // 小於範圍
        expect(result.current.currentPage).toBe(1);
    });
    it("should reset to first page when page size changes", () => {
        const { result } = renderHook(() =>
            usePagination({ datas: mockData, totalCount: mockData.length })
        );

        act(() => result.current.switchPage(3));
        expect(result.current.currentPage).toBe(3);

        act(() => result.current.changePageSize(5));
        expect(result.current.pageSize).toBe(5);
        expect(result.current.currentPage).toBe(1);
    });
    it("should slice currentData correctly", () => {
        const { result } = renderHook(() =>
            usePagination({ datas: mockData, totalCount: mockData.length })
        );

        expect(result.current.currentData.length).toBe(10);
        expect(result.current.currentData[0]).toBe("Item 1");

        act(() => result.current.switchPage(2));
        expect(result.current.currentData[0]).toBe("Item 11");
    });
});

describe("CustomPagination Component", () => {
    const mockSwitchPage = jest.fn();
    const mockChangePageSize = jest.fn();
    const paginationRange = [1, 2, "ELLIPSIS", 5];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render page buttons including ellipsis", () => {
        render(
            <CustomPagination currentPage={1} totalPages={5} paginationRange={paginationRange} switchPage={mockSwitchPage} pageSize={10} changePageSize={mockChangePageSize} />
        );

        expect(screen.getByText("1")).toBeInTheDocument();
        expect(screen.getByText("2")).toBeInTheDocument();
        expect(screen.getAllByText("More pages")).toHaveLength(1);
        expect(screen.getByText("5")).toBeInTheDocument();
    });
    it("should call switchPage when clicking a page number", async () => {
        const user = userEvent.setup();
        render(
            <CustomPagination currentPage={1} totalPages={5} paginationRange={paginationRange} switchPage={mockSwitchPage} pageSize={10} changePageSize={mockChangePageSize} />
        );

        await user.click(screen.getByText("2"));
        expect(mockSwitchPage).toHaveBeenCalledWith(2);
    });
    it("should disable previous button on first page", async () => {

        const user = userEvent.setup();

        render(
            <CustomPagination currentPage={1} totalPages={5} paginationRange={paginationRange} switchPage={mockSwitchPage} pageSize={10} changePageSize={mockChangePageSize} />
        );

        // 驗證 prev button style
        const prevButton = screen.getByLabelText("Go to previous page");
        expect(prevButton).toHaveClass("disabled:pointer-events-none");

        // 驗證使用者按下 prev button 不會觸發 switchPage
        await user.click(prevButton);
        expect(mockSwitchPage).toHaveBeenCalledTimes(0);

    });
    it("should disable next button on last page", async () => {

        const user = userEvent.setup();

        render(
            <CustomPagination currentPage={5} totalPages={5} paginationRange={paginationRange} switchPage={mockSwitchPage} pageSize={10} changePageSize={mockChangePageSize} />
        );

        // 驗證 prev button style
        const nextButton = screen.getByLabelText("Go to next page");
        expect(nextButton).toHaveClass("disabled:pointer-events-none");

        // 驗證使用者按下 prev button 不會觸發 switchPage
        await user.click(nextButton);
        expect(mockSwitchPage).toHaveBeenCalledTimes(0);

    });
    it("should trigger changePageSize when selecting a new size", async () => {
        let user = userEvent.setup();
        let CustomPagination;
       
        // 幫每個子元素都加入 onValueChange
        const propagateOnValueChange = (children, onValueChange) => {
            return React.Children.map(children, (child) => {
                if (!React.isValidElement(child)) return child;

                // 遞迴處理子元素
                const needsHandler = child.type && child.type._isSelectItem
                return React.cloneElement(
                    child,
                    needsHandler ? { onValueChange } : null,
                    propagateOnValueChange(child.props?.children, onValueChange)
                )
            });
        };

        // 渲染一個「使用 hook + CustomPagination」的小型 Harness
        function Harness() {
            const datas = Array.from({ length: 100 }, (_, i) => i + 1)
            const { currentPage, switchPage, changePageSize, totalPages, paginationRange, pageSize } =
            usePagination({ datas, totalCount: datas.length })

            // 先手動跳到第 3 頁
            React.useEffect(() => { switchPage(3) }, [])
            return (
                <CustomPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    paginationRange={paginationRange}
                    switchPage={switchPage}
                    pageSize={pageSize}
                    changePageSize={changePageSize}
                />
            )
        }


        // 在測試函式中動態 mock
        jest.isolateModules(() => {
            jest.doMock("@/components/ui/select", () => {
                const SelectItem = ({ value, children, onValueChange }) => (
                    <button
                        data-testid={`mock-select-item-${value}`}
                        onClick={() => {
                            onValueChange(value)
                        }}
                        data-value={value}
                    >
                        {children}
                    </button>
                );
                // 穩定標記
                SelectItem._isSelectItem = true
                return {
                     Select: ({ children, onValueChange }) => {
                        return (
                            <div data-testid="mock-select">
                                {propagateOnValueChange(children, onValueChange)}
                            </div>
                        );
                    },
                    SelectTrigger: ({ children }) => <div>{children}</div>,
                    SelectValue: ({ placeholder }) => <span>{placeholder}</span>,
                    SelectContent: ({ children }) => <div>{children}</div>,
                    SelectItem,
                };

            });
            // 在 mock 後再引入 Pagination
            CustomPagination = require("@/components/paginations").default;
        }); 

        render(<Harness />);

        await user.click(screen.getByTestId("mock-select-item-20"));
        // expect(mockChangePageSize).toHaveBeenCalledWith(20);

        expect(screen.getByText(1)).toHaveAttribute('aria-current', 'page')

    }); 

    afterEach(() => {
        jest.resetModules()
        jest.clearAllMocks()
    })
});