// ::TOGGLE_COMPONENT:: - components/ThemeToggle.jsx
import { useTheme } from '@/contexts/theme-context';
import { Button } from '@/components/ui/button';
// import { Sun, Moon } from 'lucide-react'; // For theme toggle icons


function SunIcon(props){return(
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden {...props}>
    <path d="M12 4V2m0 20v-2m8-8h2M2 12h2m13.657 6.343 1.414 1.414M4.929 4.929 6.343 6.343m0 11.314-1.414 1.414m12.728-12.728-1.414 1.414M12 8a4 4 0 1 1 0 8a4 4 0 0 1 0-8z" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)}
function MoonIcon(props){return(
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden {...props}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3A7 7 0 0 0 21 12.79z" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)}

export default function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
          <Button 
            variant="ghost" 
            aria-label="切換深淺模式"
            onClick={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))} 
          >
              {resolvedTheme === 'light' ? <MoonIcon size={18} /> : <SunIcon size={18} />}
          </Button>
      </div>
    </div>
  );
}