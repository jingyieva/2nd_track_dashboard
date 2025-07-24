// src/routes.jsx
import { createBrowserRouter } from "react-router-dom"
import { Layout } from "@/layouts"
import NotFound from '@/pages/404';

import ROUTES from "@/constants/routes";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
        ...ROUTES
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;