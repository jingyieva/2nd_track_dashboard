// src/layouts/PageLayout.jsx
import { Outlet } from "react-router-dom"
import Navbar from "@/components/Navbar"

export default function PageLayout() {
  return (
    <div className="min-h-screen max-w-screen-xl bg-background text-foreground flex flex-col">
      <Navbar />
      <main className="flex-1 w-full">
        <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}