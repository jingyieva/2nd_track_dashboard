
// src/pages/Dashboard/index.jsx
import { useEffect, useState } from "react";

import ChartSkeleton from "@/components/charts/ChartSkeleton";
import BelowFold from '@/components/BelowFold'
import KPICard from "@/pages/Dashboard/KPICard";
import { useVisible } from "@/hooks/useVisible";

function ChartsFoldLoader() {
  const [Mod, setMod] = useState(null)
  useEffect(() => {
    let dead = false;
    import(/* @vite-ignore */ '@/pages/Dashboard/ChartsFold')
      .then(m => { if (!dead) setMod(() => m.default) })
    return () => { dead = true }
  }, [])
  return Mod ? <Mod/> : null
}


export default function Dashboard (){

    return (
        <div className="space-y-6">
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <KPICard />
            </section>
            <BelowFold offset="0px" idle once fallback={<ChartSkeleton height="h-48 md:h-[420px]" />}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><ChartsFoldLoader/></div>
            </BelowFold>
        </div>
    )
}