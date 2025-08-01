// src/pages/Order.jsx
import Table from "@/components/tables";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
        render: ({ rowData, column }) => <Badge>{rowData[column.key]}</Badge>
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
    
    return (
        <div className="p-6 space-y-4">
            <h2 className="text-2xl font-bold">訂單列表</h2>
            <Card>
                <CardContent className="p-1">
                <Table
                    name="order"
                    columns={COLUMN_DEFS}
                    datas={MOCK_ORDERS}
                    emptyDataMsg="No order found."
                />
                </CardContent>
            </Card>
        </div>
    )
}