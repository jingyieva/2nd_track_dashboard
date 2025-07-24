// src/constants/routes.jsx
import Dashboard from '@/pages/Dashboard';
import Orders from '@/pages/Orders';
import Products from '@/pages/Products';


export const ROUTES = [
    {
        index: true,
        path: "/",
        element: <Dashboard />,
        label: "Dashboard",
    },
    {
        path: "/orders",
        element: <Orders />,
        label: "Orders",
    },
    {
        path: "/products",
        element: <Products />,
        label: "Products",
    }
];

export default ROUTES;