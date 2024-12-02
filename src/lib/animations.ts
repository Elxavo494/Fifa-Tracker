import { type ClassValue } from "clsx"
import { cn } from "./utils"

export const slideIn = (direction: "left" | "right" | "up" | "down"): ClassValue => {
  const transforms = {
    left: "-translate-x-full",
    right: "translate-x-full",
    up: "translate-y-full",
    down: "-translate-y-full"
  }

  return cn(
    "animate-in duration-500 ease-out motion-safe:transition-transform",
    transforms[direction]
  )
}

export const fadeIn = "animate-in fade-in duration-300 ease-out"
export const scaleIn = "animate-in zoom-in duration-300 ease-out"