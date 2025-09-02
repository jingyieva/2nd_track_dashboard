// src/story/Button.stories.jsx
import { Button } from '@/components/ui/button';

export default {
  title: 'UI/Button',
  component: Button,
  args: {
    children: 'Click me',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
  },
};

export const Default = {};
export const Destructive = {
  args: { variant: 'destructive' },
};
export const Outline = {
  args: { variant: 'outline' },
};
export const Ghost = {
  args: { variant: 'ghost' },
};
export const Link = {
  args: { variant: 'link' },
};
export const Large = {
  args: { size: 'lg' },
};
export const Small = {
  args: { size: 'sm' },
};
