// tests/mocks/react-helpers.js
const React = require('react')

// 把 onValueChange 向下傳到 SelectItem 之類的子節點
function propagateOnValueChange(children, onValueChange, flag = '_isSelectItem') {
  return React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child
    const pass = child.type && child.type[flag]
    return React.cloneElement(
      child,
      pass ? { onValueChange } : {},
      propagateOnValueChange(child.props?.children, onValueChange, flag),
    )
  })
}

module.exports = { React, propagateOnValueChange }
