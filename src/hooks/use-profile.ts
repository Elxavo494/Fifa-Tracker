import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"
import type { Database } from "@/types/supabase"

type Profile = Database["public"]["Tables"]["profiles"]["Row"]

interface UpdateProfileData {
  username?: string
  avatarUrl?: string | null
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { user, refreshProfile } = useAuth()

  useEffect(() => {
    let isMounted = true

    async function loadProfile() {
      try {
        if (!user) throw new Error("No user found")

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()

        if (error) {
          if (error.code === "PGRST116") {
            const { data: newProfile, error: createError } = await supabase
              .from("profiles")
              .insert({
                id: user.id,
                username: user.email?.split("@")[0] || "User",
                updated_at: new Date().toISOString(),
              })
              .select()
              .single()

            if (createError) throw createError
            if (isMounted) {
              setProfile(newProfile)
            }
          } else {
            throw error
          }
        } else if (isMounted) {
          setProfile(data)
        }
      } catch (error) {
        console.error("Error loading profile:", error)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadProfile()

    return () => {
      isMounted = false
    }
  }, [user])

  const updateProfile = async ({ username, avatarUrl }: UpdateProfileData) => {
    try {
      if (!user) throw new Error("No user found")

      const updates: Partial<Profile> = {
        updated_at: new Date().toISOString(),
      }

      if (username !== undefined) {
        updates.username = username
      }

      if (avatarUrl !== undefined) {
        updates.avatar_url = avatarUrl
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id)

      if (updateError) throw updateError

      // Refresh both local and global profile state
      const { data: newProfile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (newProfile) {
        setProfile(newProfile)
        await refreshProfile() // Update the global profile state
      }

      return { error: null }
    } catch (error) {
      console.error("Profile update error:", error)
      return { error }
    }
  }

  return {
    profile,
    isLoading,
    updateProfile,
  }
}