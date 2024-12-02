import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';

interface ModeToggleProps {
  size?: "default" | "sm" | "lg" | "xl" | "icon" | "lIcon";
  variant?: "outline" | "ghost" | "default" | "destructive" | "secondary" | "link" | "regular";
}

export function ModeToggle({ size = "icon", variant = "outline" }: ModeToggleProps) {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant={variant}
      size={size}
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      <Sun className="h-[1rem] w-[1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 p-0" stroke="white" />
      <Moon className="absolute h-[1rem] w-[1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 p-0" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
