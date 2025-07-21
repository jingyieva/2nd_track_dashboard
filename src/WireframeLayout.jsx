import { useState } from 'react'; 
import { Button } from '@/components/ui/button'; 
import { Sun, Moon } from 'lucide-react'; // For theme toggle icons

export default function WireframeLayout() {
    const [page, setPage] = useState('dashboard');
    const [theme, setTheme] = useState('light'); // Simplified theme state, replace with actual theme context

    // Simple page content switcher
    const renderContent = () => {
        switch (page) {
        case 'dashboard':
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                <div className="border rounded p-4">月交易量趨勢折線圖 (Placeholder)</div>
                <div className="border rounded p-4">獲利柱狀圖 (Placeholder)</div>
                <div className="border rounded p-4">商品類別交易量圓餅圖 (Placeholder)</div>
            </div>
        );
        case 'orders':
        return (
            <div className="p-4">
            <h2 className="text-lg font-semibold mb-2">訂單列表</h2>
            <div className="border rounded p-4">訂單表格 Placeholder</div>
            </div>
        );
        case 'products':
        return (
            <div className="p-4">
            <h2 className="text-lg font-semibold mb-2">商品列表</h2>
            <div className="border rounded p-4">商品表格 Placeholder</div>
            </div>
        );
        default:
            return null;
        }
    };

    // Simple theme toggle handler (to be replaced with real theme logic)
    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
        // TODO: connect to actual theme context/provider
    };

    return (
        <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
            <nav className="flex justify-between items-center p-4 border-b border-gray-300 dark:border-gray-700">
                <div className="flex items-center gap-2">
                    <div className="font-bold text-xl">🛒 二手交易儀表板</div>
                </div>

                <div className="flex items-center gap-4">
                    <Button variant={page === 'dashboard' ? 'default' : 'ghost'} onClick={() => setPage('dashboard')}>
                        Dashboard
                    </Button>
                    <Button variant={page === 'orders' ? 'default' : 'ghost'} onClick={() => setPage('orders')}>
                        訂單
                    </Button>
                    <Button variant={page === 'products' ? 'default' : 'ghost'} onClick={() => setPage('products')}>
                        商品
                    </Button>
                    <Button onClick={toggleTheme} variant="ghost" aria-label="切換深淺模式">
                        {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                    </Button>
                </div>
            </nav>

            <main className="flex-grow">{renderContent()}</main>
        </div>
    );
};
