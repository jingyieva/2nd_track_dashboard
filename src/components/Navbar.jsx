// src/components/Navbar.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

import { useMediaQuery } from '@/hooks/useMediaQuery';

import { Button } from '@/components/ui/button';
import ThemeToggle from "@/components/ThemeToggle";
import ROUTES from "@/constants/routes";


export default function Navbar (){
    const navigate = useNavigate();
    const isLgUp = useMediaQuery("(min-width: 1024px)")
    const [open, setOpen] = useState(false);
    const { pathname } = useLocation()
    const handleNavigate = (path) => {
        navigate(path);
    };
    // 進到 lg 直接關閉，避免殘留
    useEffect(() => {
        if (isLgUp && open) setOpen(false)
    }, [isLgUp, open])

    return (
      <header className="w-full border-b">
        <div className="container min-w-[320px]">
            <div className="flex flex-wrap items-center justify-between">
                {/* Left: Logo + Title */}
                <div className="flex items-center gap-3">
                    <img src="/logo/2nd-track-mark.svg" alt="Logo" className="h-10 w-10" />
                    <p className="text-xl md:text-3xl lg:text-5xl font-extrabold text-balance break-words">2nd Track Dashboard</p>
                </div>

                {/* Right: Dropdown + Theme toggle */}
                <div className="flex item-center gap-1">
                    {/* small screen */}                
                    <div className="block lg:hidden">
                        <DropdownMenu open={open} onOpenChange={setOpen}>
                            <DropdownMenuTrigger asChild>
                            <Button variant="outline">More</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {
                                    ROUTES.map((r) => (
                                        <DropdownMenuItem key={r.path} onSelect={() => handleNavigate(r.path)}>{r.label}</DropdownMenuItem>
                                    ))
                                }
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    {/* larger screen */}
                    <div className="hidden lg:flex items-center gap-4">
                        {
                            ROUTES.map((r) => (
                                <Button key={r.path} variant={pathname === r.path ? 'default' : 'ghost'} onClick={() => handleNavigate(r.path)}>
                                    {r.label}
                                </Button>
                            ))
                        }
                    </div>
                    <ThemeToggle />
                </div>
            </div>
        </div>
      </header>

    )
}