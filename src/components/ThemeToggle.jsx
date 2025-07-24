// ::TOGGLE_COMPONENT:: - components/ThemeToggle.jsx
import { useTheme } from '@/contexts/theme-context';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react'; // For theme toggle icons


export default function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  return (
    <div className="space-y-2">
      {/* Debug use */}
      {/* 
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Current theme: <strong>{resolvedTheme}</strong> (from {theme})
        </div>
       */}
      <div className="flex gap-2">
          <Button 
            variant="ghost" 
            aria-label="切換深淺模式"
            onClick={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))} 
          >
              {resolvedTheme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </Button>
      </div>
    </div>
  );
}