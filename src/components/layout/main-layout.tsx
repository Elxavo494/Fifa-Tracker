import { Header } from './header';
import { Toaster } from '@/components/ui/toaster';

interface MainLayoutProps {
  children: React.ReactNode;
  onProfileClick: () => void;
  onTournamentClick: () => void;
}

export function MainLayout({ children, onProfileClick, onTournamentClick }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header onProfileClick={onProfileClick} onTournamentClick={onTournamentClick} />
      <div className="container mx-auto max-w-8xl mx-auto py-8 px-4 pt-24">
        {children}
      </div>
      <Toaster />
    </div>
  );
}