import { cn } from '@/lib/utils';

interface HamburgerProps {
  open: boolean;
  className?: string;
}

export function Hamburger({ open, className }: HamburgerProps) {
  return (
    <div className={cn('relative w-6 h-6 flex flex-col justify-center gap-1.5', className)}>
      <span
        className={cn(
          'absolute h-[2px] w-6 bg-foreground transition-all duration-300 ease-out',
          open ? 'rotate-45 translate-y-0' : '-translate-y-2'
        )}
      />
      <span
        className={cn(
          'absolute h-[2px] w-6 bg-foreground transition-all duration-300 ease-out',
          open ? 'opacity-0' : 'opacity-100'
        )}
      />
      <span
        className={cn(
          'absolute h-[2px] w-6 bg-foreground transition-all duration-300 ease-out',
          open ? '-rotate-45 translate-y-0' : 'translate-y-2'
        )}
      />
    </div>
  );
} 