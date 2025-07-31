// src/layouts/PageLayout.jsx
import { Outlet } from "react-router-dom"
import Navbar from "@/components/Navbar"

export default function PageLayout() {
  return (
    // max-w-screen-2xl
    <div className="min-h-screen w-screen bg-background text-foreground flex flex-col items-center">
      <Navbar />
      <main className="max-w-4/5 w-full flex-1">
        <div className="mx-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}