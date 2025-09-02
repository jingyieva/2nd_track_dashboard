// src/stories/Input.stories.jsx
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Eye, EyeOff, X } from 'lucide-react';

export default {
  title: 'UI/Input',
  component: Input,
  args: {
    placeholder: 'Type something…',
    disabled: false,
    type: 'text',
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search', 'tel', 'url'],
    },
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
  },
};

export const Default = {};

export const Disabled = {
  args: { disabled: true, placeholder: 'Disabled input' },
};

export const Password = {
  args: { type: 'password', placeholder: 'Enter password' },
};

export const WithLabel = {
  render: (args) => (
    <div className="grid w-[320px] items-center gap-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="you@example.com" {...args} />
    </div>
  ),
};

export const WithErrorText = {
  render: (args) => (
    <div className="grid w-[320px] gap-2">
      <Label htmlFor="username">Username</Label>
      <Input
        id="username"
        placeholder="at least 6 characters"
        aria-invalid="true"
        className="border-destructive focus-visible:ring-destructive"
        {...args}
      />
      <p className="text-sm text-destructive">Username is too short.</p>
    </div>
  ),
};

export const Controlled = {
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <div className="grid w-[320px] gap-2">
        <Label htmlFor="controlled">Controlled</Label>
        <Input
          id="controlled"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          {...args}
        />
        <p className="text-sm opacity-70">Value: {value || '(empty)'}</p>
      </div>
    );
  },
};

export const IconInput = {
  render: (args) => {
    return (
      <div className="relative w-[320px] gap-2">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input className="pl-9" placeholder="Search..." />
      </div>
    );
  },
};

export const PasswordWithToggle = {
  render: (args) => {
    const [show, setShow] = useState(false);

    return (
      <div className="relative w-[320px]">
        <Input
          {...args}
          type={show ? 'text' : 'password'}
          placeholder="Enter password"
          className="pr-9"
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          onClick={() => setShow(!show)}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    );
  },
};

export const ClearInput = {
  render: (args) => {
    const [content, setContent] = useState('');

    return (
      <div className="relative w-[320px]">
        <Input
          {...args}
          placeholder="Enter "
          className="pr-9"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          onClick={() => setContent('')}
        >
           <X className="h-4 w-4" />
        </button>
      </div>
    );
  },
};