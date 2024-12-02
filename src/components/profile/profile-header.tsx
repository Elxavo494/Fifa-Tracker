import { ArrowLeft, Trophy, Menu, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { useAuth } from '@/contexts/auth-context';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet"

interface ProfileHeaderProps {
  onProfileClick: () => void
  onBack: () => void
  onTournamentClick: () => void
}

export function ProfileHeader({ onProfileClick, onBack, onTournamentClick }: ProfileHeaderProps) {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="bg-background/60 backdrop-blur-xl border-b border-border/40 py-3">
        <div className="px-2 md:px-8 mx-auto">
          <div className="flex h-16 items-center justify-between px-4">
            <div 
              className="flex items-end gap-2 cursor-pointer" 
              onClick={onBack}
            >
              <img
                src="/images/fifa.svg"
                alt="FIFA Tracker Logo"
                className="h-8 w-16 dark:hidden"
              />
              <img
                src="/images/fifa-white.svg"
                alt="FIFA Tracker Logo (White)"
                className="h-8 w-16 hidden dark:block"
              />
              <span className="text-xs font-medium text-muted-foreground">Tracker™</span>
            </div>

            {/* Desktop Menu */}
            <nav className="hidden md:flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground hover:text-foreground"
                onClick={onTournamentClick}
              >
                <Trophy className="h-4 w-4" />
                Tournament
              </Button>
              <div className="mx-2 h-4 w-px bg-border" />
              <ModeToggle variant="ghost" />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="gap-2 text-red-500 hover:text-red-600 hover:bg-red-500/10"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </nav>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="h-8 w-8 border-muted-foreground/50 p-0">
                    <Menu className="h-5 w-5 text-muted-foreground" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                      <img
                        src="/images/fifa.svg"
                        alt="FIFA Tracker Logo"
                        className="h-8 w-16 dark:hidden"
                      />
                      <img
                        src="/images/fifa-white.svg"
                        alt="FIFA Tracker Logo (White)"
                        className="h-8 w-16 hidden dark:block"
                      />
                      <span className="text-xs font-medium text-muted-foreground">
                        Tracker™
                      </span>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col h-[calc(100%-10px)]">
                    <div className="flex-1">
                      <div className="flex flex-col gap-1 mt-6">
                        <Button
                          variant="ghost"
                          size="lg"
                          className="justify-start gap-2"
                          onClick={onProfileClick}
                        >
                          <User className="h-4 w-4" />
                          Profile
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 py-4 border-t border-border">
                      <ModeToggle size="lIcon" variant="regular"/>
                      <Button
                        variant="ghost"
                        className="flex-1 gap-2 text-red-500 hover:text-red-600 hover:bg-red-500/10 border-b bg-card"
                        onClick={handleSignOut}
                        size="lg"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}