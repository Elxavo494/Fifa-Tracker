import { useState } from "react"
import { RotateCcw, Shuffle, Swords } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { TeamForm } from "./team-form"
import { QuickScore } from "./quick-score"
import type { Match, User } from "@/types"

interface MatchFormProps {
  users: User[]
  onAddMatch: (match: Match) => void
}

interface TeamState {
  players: User[]
  score: string
}

const emptyPlayer = { id: "", name: "", avatarUrl: "" }

export function MatchForm({ users, onAddMatch }: MatchFormProps) {
  const [team1, setTeam1] = useState<TeamState>({
    players: [emptyPlayer],
    score: ""
  })
  const [team2, setTeam2] = useState<TeamState>({
    players: [emptyPlayer],
    score: ""
  })
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all fields are filled
    if (!team1.players.every(p => p.id) || !team2.players.every(p => p.id)) {
      toast({
        title: "Error",
        description: "Please select all players",
        variant: "destructive",
      })
      return
    }

    if (!team1.score || !team2.score) {
      toast({
        title: "Error",
        description: "Please enter scores for both teams",
        variant: "destructive",
      })
      return
    }

    const match: Match = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      team1: {
        players: team1.players,
        score: parseInt(team1.score)
      },
      team2: {
        players: team2.players,
        score: parseInt(team2.score)
      }
    }

    onAddMatch(match)
    resetForm()
  }

  const resetForm = () => {
    setTeam1({
      players: [emptyPlayer],
      score: ""
    })
    setTeam2({
      players: [emptyPlayer],
      score: ""
    })
  }

  const getUsedPlayerIds = () => {
    const usedIds = new Set<string>()
    team1.players.forEach(p => p.id && usedIds.add(p.id))
    team2.players.forEach(p => p.id && usedIds.add(p.id))
    return usedIds
  }

  const handleQuickScoreSelect = (team1Score: number, team2Score: number) => {
    setTeam1(prev => ({
      ...prev,
      score: team1Score.toString()
    }))
    setTeam2(prev => ({
      ...prev,
      score: team2Score.toString()
    }))
  }

  const handleRandomSelection = () => {
    // Get all currently selected players
    const selectedPlayers = [
      ...team1.players.filter(p => p.id),
      ...team2.players.filter(p => p.id)
    ]

    // If no players are selected, use all available players
    const playersToRandomize = selectedPlayers.length > 0 ? selectedPlayers : users
    
    // Shuffle the players
    const shuffledPlayers = [...playersToRandomize]
      .sort(() => Math.random() - 0.5)
    
    // Calculate how many players we need for each team
    const team1Size = team1.players.length
    const team2Size = team2.players.length
    
    // Split the shuffled players between teams
    const team1Players = shuffledPlayers.slice(0, team1Size)
    const team2Players = shuffledPlayers.slice(team1Size, team1Size + team2Size)

    // Update state
    setTeam1(prev => ({
      ...prev,
      players: team1Players.length === team1Size ? team1Players : prev.players
    }))
    
    setTeam2(prev => ({
      ...prev,
      players: team2Players.length === team2Size ? team2Players : prev.players
    }))
  }

  const handleResetTeams = () => {
    setTeam1(prev => ({
      ...prev,
      players: prev.players.map(() => emptyPlayer)
    }))
    setTeam2(prev => ({
      ...prev,
      players: prev.players.map(() => emptyPlayer)
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleResetTeams}
          className="rounded-full bg-secondary p-0 h-8 w-8 -mt-12"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleRandomSelection}
          className="rounded-full bg-secondary p-0 h-8 w-8 -mt-12"
        >
          <Shuffle className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-2 md:gap-6">
        <TeamForm
          teamNumber={1}
          players={users}
          selectedPlayers={team1.players}
          score={team1.score}
          usedPlayerIds={getUsedPlayerIds()}
          onPlayerAdd={() => setTeam1(prev => ({
            ...prev,
            players: [...prev.players, emptyPlayer]
          }))}
          onPlayerRemove={(index) => setTeam1(prev => ({
            ...prev,
            players: prev.players.filter((_, i) => i !== index)
          }))}
          onPlayerSelect={(index, playerId) => setTeam1(prev => ({
            ...prev,
            players: prev.players.map((p, i) => 
              i === index ? users.find(u => u.id === playerId) || p : p
            )
          }))}
          onScoreChange={(value) => setTeam1(prev => ({ ...prev, score: value }))}
        />

        <TeamForm
          teamNumber={2}
          players={users}
          selectedPlayers={team2.players}
          score={team2.score}
          usedPlayerIds={getUsedPlayerIds()}
          onPlayerAdd={() => setTeam2(prev => ({
            ...prev,
            players: [...prev.players, emptyPlayer]
          }))}
          onPlayerRemove={(index) => setTeam2(prev => ({
            ...prev,
            players: prev.players.filter((_, i) => i !== index)
          }))}
          onPlayerSelect={(index, playerId) => setTeam2(prev => ({
            ...prev,
            players: prev.players.map((p, i) => 
              i === index ? users.find(u => u.id === playerId) || p : p
            )
          }))}
          onScoreChange={(value) => setTeam2(prev => ({ ...prev, score: value }))}
        />
      </div>

      <QuickScore onSelect={handleQuickScoreSelect} />

      <Button type="submit" className="w-full">
        <Swords className="mr-2 h-4 w-4" />
        Record Match
      </Button>
    </form>
  )
}