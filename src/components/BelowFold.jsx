// src/components/BelowFold.jsx
import { useEffect, useState } from 'react'
import { useVisible } from '@/hooks/useVisible'

export default function BelowFold({
  offset = '0px',          // rootMargin
  idle = true,             // 可見後用 requestIdleCallback 再載，降低爭用
  once = true,             // 觸發一次就結束
  fallback = null,         // 骨架
  children,                // 真正內容（或 loader）
}) {
  const { ref, visible, disconnect } = useVisible(offset, { once })
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!visible || show) return
    const run = () => setShow(true)

    if (idle && 'requestIdleCallback' in window) {
      const id = requestIdleCallback(run)
      return () => cancelIdleCallback(id)
    } else {
      const t = setTimeout(run, 0)
      return () => clearTimeout(t)
    }
  }, [visible, show, idle])

  useEffect(() => { if (once && show && disconnect) disconnect() }, [once, show, disconnect])

  return (
    <section>
      <div ref={ref} className="h-px w-full" aria-hidden /> {/* 哨兵，隱形不佔版面 */}
      {show ? children : fallback}
    </section>
  )
}
