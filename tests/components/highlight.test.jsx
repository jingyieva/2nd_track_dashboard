// src/__tests__/Highlight.test.jsx
import { render, screen } from "@testing-library/react";
import React from "react";
import Highlight from '@/components/Highlight';


test("關鍵字高亮（大小寫不敏感）", () => {
  render(<Highlight text="Order 20250716001" term="order" />);
  // 被 <mark> 包住
  const marks = screen.getAllByText(/order/i);
  expect(marks[0].tagName.toLowerCase()).toBe("mark");
});