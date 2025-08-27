const { React, propagateOnValueChange } = require('../../../../tests/mock/react-helpers')

const SelectItem = ({ value, children, onValueChange }) =>
  React.createElement(
    'button',
    {
      type: 'button',
      'data-testid': `select-item-${value}`,
      onClick: () => onValueChange?.(value),
    },
    children
  )
SelectItem._isSelectItem = true

module.exports = {
  __esModule: true,
  Select: ({ children, onValueChange }) =>
    React.createElement('div', { 'data-testid': 'mock-select' }, propagateOnValueChange(children, onValueChange)),
  SelectTrigger: ({ children }) => React.createElement('div', null, children),
  SelectValue: ({ placeholder }) => React.createElement('span', null, placeholder),
  SelectContent: ({ children }) => React.createElement('div', null, children),
  SelectItem,
}
