// ::TOGGLE_COMPONENT:: - components/ThemeToggle.jsx
import { useTheme } from '@/contexts/theme-context';
import { Button } from '@/components/ui/button';


export default function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  return (
    <div className="space-y-2">
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Current theme: <strong>{resolvedTheme}</strong> (from {theme})
      </div>
      <div className="flex gap-2">
        {['light', 'dark', 'system'].map((t) => (
          <Button
            key={t}
            className={`px-3 py-1 rounded transition-colors duration-300 
              
              ${
                theme === t
                  ? 'bg-blue-600 text-white dark:bg-blue-700 dark:text-white font-semibold'
                  : 'bg-blue-100 text-blue-800 dark:bg-gray-900 dark:text-gray-400'
              }
            `}
            onClick={() => setTheme(t)}
          >
            {t}
          </Button>
        ))}
      </div>
    </div>
  );
}