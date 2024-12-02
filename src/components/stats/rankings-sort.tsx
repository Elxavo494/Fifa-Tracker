import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type SortOption = "points" | "winrate"

interface RankingsSortProps {
  onSortChange: (option: SortOption) => void
  currentSort: SortOption
}

export function RankingsSort({ onSortChange, currentSort }: RankingsSortProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto">
          <ArrowUpDown className="mr-2 h-4 w-4" />
          Sort by {currentSort === "points" ? "Points" : "Win Rate"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onSortChange("points")}>
          Sort by Points
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSortChange("winrate")}>
          Sort by Win Rate
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}