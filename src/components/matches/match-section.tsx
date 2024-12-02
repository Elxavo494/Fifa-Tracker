import { Swords } from "lucide-react"
import { MatchForm } from "./match-form"
import type { Match, User } from "@/types"

interface MatchSectionProps {
  users: User[]
  onAddMatch: (match: Match) => void
}

export function MatchSection({ users, onAddMatch }: MatchSectionProps) {
  return (
    <div className="space-y-4 p-6 rounded-md border bg-card">
      <h2 className="text-2xl font-semibold flex items-center gap-2">
        <Swords className="h-5 w-5" />
        Record Match
      </h2>
      <MatchForm users={users} onAddMatch={onAddMatch} />
    </div>
  )
}