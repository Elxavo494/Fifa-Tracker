import { useState } from "react"
import { Swords } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import type { Match, Player } from "@/types"

interface MatchFormProps {
  players: Player[]
  onAddMatch: (match: Match) => void
}

export function MatchForm({ players, onAddMatch }: MatchFormProps) {
  const [team1Player1, setTeam1Player1] = useState("")
  const [team1Player2, setTeam1Player2] = useState("")
  const [team2Player1, setTeam2Player1] = useState("")
  const [team2Player2, setTeam2Player2] = useState("")
  const [team1Score, setTeam1Score] = useState("")
  const [team2Score, setTeam2Score] = useState("")
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!team1Player1 || !team1Player2 || !team2Player1 || !team2Player2 || !team1Score || !team2Score) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    const match: Match = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      team1: {
        players: [
          players.find(p => p.id === team1Player1)!,
          players.find(p => p.id === team1Player2)!
        ] as [Player, Player],
        score: parseInt(team1Score)
      },
      team2: {
        players: [
          players.find(p => p.id === team2Player1)!,
          players.find(p => p.id === team2Player2)!
        ] as [Player, Player],
        score: parseInt(team2Score)
      }
    }

    onAddMatch(match)
    resetForm()
  }

  const resetForm = () => {
    setTeam1Player1("")
    setTeam1Player2("")
    setTeam2Player1("")
    setTeam2Player2("")
    setTeam1Score("")
    setTeam2Score("")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <h3 className="font-semibold">Team 1</h3>
          <Select value={team1Player1} onValueChange={setTeam1Player1}>
            <SelectTrigger>
              <SelectValue placeholder="Select player 1" />
            </SelectTrigger>
            <SelectContent>
              {players.map((player) => (
                <SelectItem key={player.id} value={player.id}>
                  {player.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={team1Player2} onValueChange={setTeam1Player2}>
            <SelectTrigger>
              <SelectValue placeholder="Select player 2" />
            </SelectTrigger>
            <SelectContent>
              {players.map((player) => (
                <SelectItem key={player.id} value={player.id}>
                  {player.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="number"
            placeholder="Score"
            value={team1Score}
            onChange={(e) => setTeam1Score(e.target.value)}
            min="0"
          />
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold">Team 2</h3>
          <Select value={team2Player1} onValueChange={setTeam2Player1}>
            <SelectTrigger>
              <SelectValue placeholder="Select player 1" />
            </SelectTrigger>
            <SelectContent>
              {players.map((player) => (
                <SelectItem key={player.id} value={player.id}>
                  {player.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={team2Player2} onValueChange={setTeam2Player2}>
            <SelectTrigger>
              <SelectValue placeholder="Select player 2" />
            </SelectTrigger>
            <SelectContent>
              {players.map((player) => (
                <SelectItem key={player.id} value={player.id}>
                  {player.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="number"
            placeholder="Score"
            value={team2Score}
            onChange={(e) => setTeam2Score(e.target.value)}
            min="0"
          />
        </div>
      </div>
      <Button type="submit" className="w-full">
        <Swords className="mr-2 h-4 w-4" />
        Record Match
      </Button>
    </form>
  )
}