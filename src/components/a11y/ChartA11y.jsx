// src/components/a11y/ChartA11y.jsx
import VisuallyHidden from "@/components/a11y/VisuallyHidden";

export default function ChartA11y({
  titleId,
  descId,
  titleText,           // 可選：若已經有可見的標題，就只用來填 aria-describedby
  descText,            // 建議傳入：這張圖要說什麼
  children,
  className,
}) {
  return (
    <div role="img" aria-labelledby={titleId} aria-describedby={descId} className={className}>
      {/* 描述供螢幕閱讀器用 */}
      <VisuallyHidden id={descId}>{descText || titleText}</VisuallyHidden>
      {children}
    </div>
  );
}
