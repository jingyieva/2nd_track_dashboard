// src/constants/routes.jsx

// import Dashboard from '@/pages/Dashboard';
// import Orders from '@/pages/Orders';
// import Products from '@/pages/Products';

export const ROUTES_META = [
    {
        key: "dashboard",
        index: true,
        path: "/",
        // element: <Dashboard />,
        label: "Dashboard",
        feature: 'core'
    },
    {
        key: "orders",
        path: "/orders",
        // element: <Orders />,
        label: "Orders",
        feature: 'orders'
    },
    {
        key: "products",
        path: "/products",
        // element: <Products />,
        label: "Products",
        feature: 'products'
    }
];

// 元件註冊表（lazy import 工廠），保持 key 對應
export const REGISTRY = {
    dashboard: () => import('@/pages/Dashboard'),
    orders:    () => import('@/pages/Orders'),
    products:  () => import('@/pages/Products'),
};

export default ROUTES_META;