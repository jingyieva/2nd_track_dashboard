// src/story/Button.stories.jsx
import { Badge } from '@/components/ui/badge';

export default {
    title: 'UI/Badge',
    component: Badge,
    argTypes: {
        variant: {
            control: 'select',
            options: [
                'default', 
                'destructive', 
                'secondary', 
                'success', 
                'successSubtle', 
                'warning',
                'warningSubtle',
                'info',
                'infoSubtle',
            ],
        },
    }
};

export const Default = {
    args: {
        children: 'Default'
    },
};
export const Destructive = {
    args: { 
        variant: 'destructive',
        children: 'Destructive'
    },
};
export const Secondary = {
    args: { 
        variant: 'secondary',
        children: 'Secondary'
    },
};

export const Success = {
    args: { 
        variant: 'success',
        children: 'Success'
    },
};

export const Warning = {
    args: { 
        variant: 'warning',
        children: 'Warning'
    },
};

export const Info = {
    args: { 
        variant: 'info' ,
        children: 'Info'
    },
};

export const SuccessSubtle = {
    args: { 
        variant: 'successSubtle' ,
        children: 'SuccessSubtle'
    },
};

export const WarningSubtle = {
    args: { 
        variant: 'warningSubtle' ,
        children: 'Warning Subtle'
    },
};

export const InfoSubtle = {
    args: { 
        variant: 'infoSubtle' ,
        children: 'Info Subtle'
    },
};