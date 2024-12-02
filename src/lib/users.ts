import { supabase } from "./supabase"
import type { User } from "@/types"

export async function getUsers(): Promise<User[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, avatar_url")
    .order("username")

  if (error) {
    console.error("Error fetching users:", error)
    return []
  }

  return data.map(profile => ({
    id: profile.id,
    name: profile.username || "Unknown User",
    avatarUrl: profile.avatar_url
  }))
}