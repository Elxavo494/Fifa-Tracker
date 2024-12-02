import { LucideIcon, ArrowDown, ArrowUp, Trophy, Users, User, Flame, Shield, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { scaleIn } from "@/lib/animations"

interface ProfileStatsProps {
  title: string
  value: number
  suffix?: string
  icon: string
  trend?: "up" | "down" | "neutral"
  className?: string
}

const iconMap: Record<string, LucideIcon> = {
  ArrowDown,
  ArrowUp,
  Trophy,
  Users,
  User,
  Flame,
  Shield,
  TrendingUp
}

export function ProfileStats({
  title,
  value,
  suffix = "",
  icon,
  trend,
  className
}: ProfileStatsProps) {
  const Icon = iconMap[icon]

  return (
    <div className={cn("rounded-lg border bg-card p-4 transition-all hover:scale-105", scaleIn)}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h4 className={cn("text-2xl font-bold mt-1", className)}>
            {value}
            {suffix}
          </h4>
        </div>
        <div className={cn(
          "p-2 rounded-full transition-colors",
          icon === "Flame" ? "bg-orange-500/10" : cn(
            trend === "up" && "bg-green-500/10",
            trend === "down" && "bg-red-500/10",
            !trend && "bg-muted"
          )
        )}>
          <Icon className={cn(
            "h-4 w-4",
            icon === "Flame" ? "text-orange-500" : cn(
              trend === "up" && "text-green-500",
              trend === "down" && "text-red-500"
            )
          )} />
        </div>
      </div>
    </div>
  )
}