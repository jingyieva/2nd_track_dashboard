// src/App.jsx
import { ThemeProvider } from '@/contexts/theme-context';
import ThemeToggle from "@/components/ThemeToggle";

export default function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
        <div className="max-w-2xl mx-auto py-12 px-4">
          <h1 className="text-3xl font-bold mb-4">🧪 二手交易分析儀表板</h1>
          <p className="text-lg">這是最小可展示版，支援深淺色切換。</p>
          <ThemeToggle></ThemeToggle>
        </div>
      </div>
    </ThemeProvider>
  )
}