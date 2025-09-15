// src/components/Navbar.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

import { useMediaQuery } from '@/hooks/useMediaQuery';

import NavbarMobileMenuLoader from "@/components/NavbarMobileMenuLoader";
import { Button } from '@/components/ui/button';
import ThemeToggle from "@/components/ThemeToggle";
import ROUTES from "@/constants/routes";


export default function Navbar (){
    const navigate = useNavigate();
    const isLgUp = useMediaQuery("(min-width: 1024px)")
    const [mobileOpen, setMobileOpen] = useState(false);
    const { pathname } = useLocation()
    const handleNavigate = (path) => {
        navigate(path);
    };
    // 進到 lg 直接關閉，避免殘留
    useEffect(() => {
        if (isLgUp && mobileOpen) setMobileOpen(false)
    }, [isLgUp, mobileOpen])

    return (
      <header className="w-full border-b">
        <div className="container min-w-[320px]">
            <div className="flex flex-wrap items-center justify-between">
                {/* Left: Logo + Title */}
                <div className="flex items-center gap-3">
                    <Link aria-label="Home" to={"/"} >
                        <img 
                            src="/logo/2nd-track-mark.svg" 
                            alt="2nd Track Dashboard" 
                            title="2nd Track Dashboard" 
                            fetchPriority="low" 
                            decoding="async" 
                            className="h-10 w-10" 
                            width="40" 
                            height="40" 
                        />
                    </Link>
                    <Link aria-label="Home" to={"/"} >
                        <h1 className="sr-only md:not-sr-only text-2xl md:text-4xl lg:text-5xl 
                            font-extrabold leading-tight tracking-tight break-words md:[text-wrap:balance]">
                            2nd Track Dashboard
                        </h1>
                    </Link>
                </div>

                {/* Right: Dropdown + Theme toggle */}
                <div className="flex item-center gap-1">
                    {/* small screen */}                
                    <div className="block lg:hidden">
                        <NavbarMobileMenuLoader open={mobileOpen} onOpenChange={setMobileOpen} />
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