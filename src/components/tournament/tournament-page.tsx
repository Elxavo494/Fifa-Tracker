import { TournamentHeader } from "./tournament-header"
import { TournamentHistory } from "./tournament-history"
import { TournamentCreator } from "./tournament-creator"
import { TournamentBracket } from "./tournament-bracket"
import { TournamentStats } from "./tournament-stats"
import { useState } from "react"
import { useTournament } from "@/hooks/use-tournament"
import type { Tournament } from "@/types/tournament"

interface TournamentPageProps {
  onBack: () => void
  onProfileClick: () => void
  onHomeClick: () => void
}

export function TournamentPage({ onBack, onProfileClick, onHomeClick }: TournamentPageProps) {
  const [activeTournament, setActiveTournament] = useState<Tournament | null>(null)
  const { tournaments, isLoading, addTournament, finishTournament } = useTournament()

  const handleCreateTournament = (tournament: Tournament) => {
    addTournament(tournament)
    setActiveTournament(tournament)
  }

  const handleTournamentSelect = (tournament: Tournament) => {
    setActiveTournament(tournament)
  }

  const handleFinalizeTournament = async (winnerId: string) => {
    if (!activeTournament) return
    await finishTournament(activeTournament.id, winnerId)
    setActiveTournament(null)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TournamentHeader onBack={onBack} onProfileClick={onProfileClick} onHomeClick={onHomeClick} />
      <div className="container mx-auto max-w-8xl py-8 px-4 pt-24 space-y-3">
        {!activeTournament ? (
          <>
            <TournamentHistory 
              tournaments={tournaments} 
              isLoading={isLoading}
              onTournamentSelect={handleTournamentSelect}
            />
            <TournamentStats tournaments={tournaments} />
            <TournamentCreator 
              onCreateTournament={handleCreateTournament} 
            />
          </>
        ) : (
          <TournamentBracket 
            tournament={activeTournament} 
            onTournamentUpdate={setActiveTournament}
            onFinalize={handleFinalizeTournament}
            onBack={() => setActiveTournament(null)}
          />
        )}
      </div>
    </div>
  )
}