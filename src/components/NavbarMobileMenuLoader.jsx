import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function NavbarMobileMenuLoader({ open, onOpenChange }) {
    const [Comp, setComp] = useState(null);

    const prefetch = () => import(/* @vite-ignore */ '@/components/MobileMenu');
    const loadAndOpen = async () => {
        if (!Comp) {
            const mod = await import(/* @vite-ignore */'@/components/MobileMenu');
            setComp(() => mod.default);
        }
        onOpenChange(true);
    }

    if (Comp) {
        const Menu = Comp;
        return ( 
            <Menu open={open} onOpenChange={onOpenChange} />
        );
    }
    return (
        <Button variant="outline" onClick={loadAndOpen} onPointerEnter={prefetch}>
            More
        </Button>
    );
}