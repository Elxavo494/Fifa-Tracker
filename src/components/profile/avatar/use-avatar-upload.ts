import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"
import { compressImage } from "@/lib/image"
import { validateImageFile } from "@/lib/validators/file"
import { deleteOldAvatar, uploadFile } from "@/lib/storage"
import { FileValidationError, StorageError } from "@/lib/errors"

export function useAvatarUpload() {
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const uploadAvatar = async (file: File, userId: string): Promise<string> => {
    try {
      setIsUploading(true)
      validateImageFile(file)

      const compressedFile = await compressImage(file)
      const fileExt = file.name.split(".").pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `${userId}/${fileName}`

      // Get current profile data
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", userId)
        .single()

      if (profileError) {
        console.error("Error fetching profile:", profileError)
        throw new StorageError("Failed to fetch profile data")
      }

      // Delete old avatar if it exists
      if (profileData?.avatar_url) {
        await deleteOldAvatar(userId, profileData.avatar_url)
      }

      // Upload new avatar
      const publicUrl = await uploadFile("avatars", filePath, compressedFile)

      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      })

      return publicUrl

    } catch (error) {
      console.error("Avatar upload error:", error)
      
      let message = "Failed to upload avatar"
      if (error instanceof FileValidationError || error instanceof StorageError) {
        message = error.message
      }
      
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      })
      
      throw error
    } finally {
      setIsUploading(false)
    }
  }

  return {
    uploadAvatar,
    isUploading,
  }
}