// src/components/charts/ChartSkeleton.jsx
export default function ChartSkeleton({ height = "h-64", className = "" }) {
  return (
    <div
      role="status"
      aria-busy="true"
      className={`w-full ${height} rounded-xl border bg-card/50 ${className}`}
    >
      <div className="h-full w-full animate-pulse rounded-xl overflow-hidden">
        {/* 背景打底 */}
        <div className="h-full w-full bg-muted/40 relative">
          {/* 模擬座標軸/格線 */}
          <div className="absolute inset-0 [background-image:repeating-linear-gradient(0deg,transparent,transparent_22px,theme(colors.muted.DEFAULT)_23px)] opacity-40" />
          {/* 模擬一條曲線/棒狀 */}
          <div className="absolute bottom-4 left-4 right-4 h-24 bg-muted/60 rounded-md" />
        </div>
      </div>
    </div>
  );
}