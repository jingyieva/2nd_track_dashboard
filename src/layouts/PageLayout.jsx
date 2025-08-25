// src/layouts/PageLayout.jsx
import { Outlet } from "react-router-dom"
import Navbar from "@/components/Navbar"

export default function PageLayout() {
  return (
    <div className="min-h-dvh w-full bg-background text-foreground">
      <Navbar />
      <main className="w-full flex-1">
        {/* <div className="mx-auto w-full max-w-screen-2xl px-4 py-4 md:px-6 lg:px-8"> */}
        <div className="container min-w-[320px]">
          <Outlet />
        </div>
      </main>
    </div>
  )
}