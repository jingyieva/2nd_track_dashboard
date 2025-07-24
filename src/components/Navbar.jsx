// src/components/Navbar.jsx
import { useNavigate, useLocation } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

import { Button } from '@/components/ui/button';
import ThemeToggle from "@/components/ThemeToggle";
import ROUTES from "@/constants/routes";

export default function Navbar (){
    const navigate = useNavigate();
    const { pathname, ...others } = useLocation()
    console.log(others)
    const handleNavigate = (path) => {
        navigate(path);
    };
    return (
      <header className="w-full border-b">
        <div className="flex items-center justify-between px-4 py-3">
            {/* Left: Logo + Title */}
            <div className="flex items-center gap-3">
            <img src="/vite.svg" alt="Logo" className="h-6 w-6" />
            <h1 className="text-lg font-bold">2nd Track Dashboard</h1>
            </div>

            {/* Right: Dropdown + Theme toggle */}
            <div className="flex items-center gap-4">
            {/* <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="outline">切換頁面</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => handleNavigate('/')}>儀表板</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleNavigate('/orders')}>訂單列表</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleNavigate('/products')}>商品列表</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu> */}
            {
                ROUTES.map((r) => (
                    <Button variant={pathname === r.path ? 'default' : 'ghost'} onClick={() => handleNavigate(r.path)}>
                        {r.label}
                    </Button>
                ))
            }
            <ThemeToggle />
            </div>
        </div>
      </header>

    )
}