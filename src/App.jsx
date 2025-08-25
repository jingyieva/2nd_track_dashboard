// src/App.jsx
import { Suspense, useMemo } from 'react';
import { RouterProvider } from 'react-router-dom';

import { ThemeProvider } from '@/contexts/theme-context';
import makeRouter from "@/routes"
import { defaultFeatures } from '@/constants/features';

export default function App() {
    const router = useMemo(() => makeRouter(defaultFeatures), []);
    return (
        <ThemeProvider>
            <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Loading…</div>}>
                <RouterProvider router={router} />
            </Suspense>
        </ThemeProvider>
    )
}