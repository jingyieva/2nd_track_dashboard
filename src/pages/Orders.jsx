// src/pages/Order.jsx
import { useState, useRef } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { usePagination } from "@/hooks/usePagination";

import Table from "@/components/tables";
import Pagination from '@/components/paginations';


const MOCK_ORDERS = [
  {
    order_id: "20250716001",
    order_date: "2025-07-16",
    platform: '蝦皮',
    commission_fee: 176,
    shipping_fee_payer: "買家",
    shipping_fee: 45,
    cost: 0,
    sales: 2350,
    revenue: 2174
  },
    {
    order_id: "20250716002",
    order_date: "2025-07-16",
    platform: '蝦皮',
    commission_fee: 176,
    shipping_fee_payer: "買家",
    shipping_fee: 45,
    cost: 0,
    sales: 2350,
    revenue: 2174
  },
    {
    order_id: "20250716003",
    order_date: "2025-07-16",
    platform: '蝦皮',
    commission_fee: 176,
    shipping_fee_payer: "買家",
    shipping_fee: 45,
    cost: 0,
    sales: 2350,
    revenue: 2174
  },
    {
    order_id: "20250716004",
    order_date: "2025-07-16",
    platform: '蝦皮',
    commission_fee: 176,
    shipping_fee_payer: "買家",
    shipping_fee: 45,
    cost: 0,
    sales: 2350,
    revenue: 2174
  },
    {
    order_id: "20250716005",
    order_date: "2025-07-16",
    platform: '蝦皮',
    commission_fee: 176,
    shipping_fee_payer: "買家",
    shipping_fee: 45,
    cost: 0,
    sales: 2350,
    revenue: 2174
  },
    {
    order_id: "20250716006",
    order_date: "2025-07-16",
    platform: '蝦皮',
    commission_fee: 176,
    shipping_fee_payer: "買家",
    shipping_fee: 45,
    cost: 0,
    sales: 2350,
    revenue: 2174
  },
    {
    order_id: "20250716007",
    order_date: "2025-07-16",
    platform: '蝦皮',
    commission_fee: 176,
    shipping_fee_payer: "買家",
    shipping_fee: 45,
    cost: 0,
    sales: 2350,
    revenue: 2174
  },
    {
    order_id: "20250720001",
    order_date: "2025-07-20",
    platform: '蝦皮',
    commission_fee: 176,
    shipping_fee_payer: "買家",
    shipping_fee: 45,
    cost: 0,
    sales: 2350,
    revenue: 2174
  },
    {
    order_id: "20250730001",
    order_date: "2025-07-30",
    platform: '蝦皮',
    commission_fee: 176,
    shipping_fee_payer: "買家",
    shipping_fee: 45,
    cost: 0,
    sales: 2350,
    revenue: 2174
  },
    {
    order_id: "20250730002",
    order_date: "2025-07-30",
    platform: '蝦皮',
    commission_fee: 176,
    shipping_fee_payer: "買家",
    shipping_fee: 45,
    cost: 0,
    sales: 2350,
    revenue: 2174
  },
  {
    order_id: "20250801001",
    order_date: "2025-08-01",
    platform: '蝦皮',
    commission_fee: 176,
    shipping_fee_payer: "買家",
    shipping_fee: 45,
    cost: 0,
    sales: 2350,
    revenue: 2174
  },
];			

const COLUMN_DEFS = [
    {
        key: 'order_id',
        name: '訂單編號',
    },
    {
        key: 'order_date',
        name: '訂單日期',
        formatter: ({ value }) => new Date(value).toLocaleDateString(),
    },
    {
        key: 'platform',
        name: '銷售平台',
        render: ({ value }) => <Badge>{value}</Badge>
    },
    {
        key: 'commission_fee',
        name: '平台抽成金額',
        formatter: ({ value }) => value?.toLocaleString?.() ?? '-', // 數字格式化
    },
    {
        key: 'shipping_fee_payer',
        name: '運費負擔方',
    },
    {
        key: 'shipping_fee',
        name: '運費',
        formatter: ({ value }) => value?.toLocaleString?.() ?? '-', // 數字格式化
    },
    {
        key: 'cost',
        name: '總成本',
        formatter: ({ value }) => value?.toLocaleString?.() ?? '-', // 數字格式化
    },
    {
        key: 'sales',
        name: '訂單總金額',
        formatter: ({ value }) => value?.toLocaleString?.() ?? '-', // 數字格式化
    },
    {
        key: 'revenue',
        name: '淨收入',
        formatter: ({ value }) => value?.toLocaleString?.() ?? '-', // 數字格式化
    },
    {
        key: 'operation',
        name: '操作',
        actions: [ 
            {
                id: 'toOrderDetail',
                action: ({ navigate , data }) => {
                    navigate(`order/${data.order_id}`)
                }
            },
        ]
    }
]

export default function Orders (){
    const [datas] = useState(MOCK_ORDERS);
    const tableRef = useRef(null);

    const { currentPage, 
        switchPage, 
        changePageSize,
        currentData, 
        totalPages, 
        paginationRange, pageSize } = usePagination({
            datas, totalCount: datas.length, 
            scrollTargetRef: tableRef,
            scrollOffset: 80, // 預留空間給固定 header
         });

    return (
        <div className="p-6 space-y-4">
            <h2 className="text-2xl font-bold">訂單列表</h2>
            <Card>
                <CardContent className="p-1" ref={tableRef}>
                    <Table
                        name="order"
                        columns={COLUMN_DEFS}
                        datas={currentData}
                        emptyDataMsg="No order found."
                    />
                    <Pagination 
                        paginationRange={paginationRange}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        switchPage={switchPage}
                        pageSize={pageSize}
                        changePageSize={changePageSize}
                    />
                </CardContent>
            </Card>
        </div>
    )
}