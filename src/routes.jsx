// src/routes.jsx
import { createBrowserRouter } from "react-router-dom"
import { Layout } from "@/layouts"
import NotFound from '@/pages/404';

import { ROUTES_META, REGISTRY } from "@/constants/routes";

// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <Layout />,
//     children: [
//         ...ROUTES
//     ],
//   },
//   {
//     path: '*',
//     element: <NotFound />,
//   },
// ]);

// features 來自執行時（或 .env），只組裝允許的路由
export function makeRouter(features = {}) {
  const visible = ROUTES_META.filter(r => features[r.feature]);

  return createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      children: visible.map(r => ({
        index: !!r.index,
        path: r.index ? undefined : r.path,       // v7：index 子路由不能有 path
        // v7 原生路由分包：回傳 { Component, loader, action, ... } 任你擴充
        lazy: async () => {
          const mod = await REGISTRY[r.key]();
          return { Component: mod.default };
        },
      })),
    },
    {
      path: '*',
      lazy: async () => ({ Component: (await import('@/pages/404')).default }),
    },
  ]);
}

export default makeRouter;