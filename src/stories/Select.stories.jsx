import { useState } from 'react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const defaultItems = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'grapes', label: 'Grapes' },
  { value: 'orange', label: 'Orange' },
];

export default {
  title: 'UI/Select',
  component: Select,
  args: {
    placeholder: 'Select a fruit',
    items: defaultItems,
    disabled: false,
  },
  argTypes: {
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    items: { control: 'object' },
  },
};

function SelectBox({ placeholder, items, disabled, value, onValueChange }) {
  return (
    <Select disabled={disabled} value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[240px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          {items.map((it) => (
            <SelectItem key={it.value} value={it.value}>
              {it.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export const Default = {
  render: (args) => <SelectBox {...args} />,
};

export const WithLabel = {
  render: (args) => (
    <div className="grid w-[260px] gap-2">
      <Label htmlFor="fruit">Fruit</Label>
      <SelectBox {...args} />
    </div>
  ),
};

export const Disabled = {
  render: (args) => <SelectBox {...args} disabled />,
};

export const WithManyOptions = {
  render: (args) => {
    const many = Array.from({ length: 20 }, (_, i) => ({
      value: `item-${i + 1}`,
      label: `Item ${i + 1}`,
    }));
    return <SelectBox {...args} items={many} placeholder="Pick an item" />;
  },
};

export const Controlled = {
  render: (args) => {
    const [val, setVal] = useState('banana');
    return (
      <div className="grid gap-2">
        <SelectBox
          {...args}
          value={val}
          onValueChange={(v) => setVal(v)}
          placeholder="Select…"
        />
        <p className="text-sm opacity-70">Selected: {val}</p>
      </div>
    );
  },
};
