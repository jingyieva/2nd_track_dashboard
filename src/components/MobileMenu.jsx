//src/components/MobileMenu.jsx
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import ROUTES from '@/constants/routes'

export default function MobileMenu({ open, onOpenChange, autoOpen = false }){
    const navigate = useNavigate();
    const handleNavigate = (path) => {
        navigate(path);
    };

    return (
        <DropdownMenu open={open ?? autoOpen} onOpenChange={onOpenChange}>
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
    );

}