import { supabase } from "./supabase"
import { StorageError } from "./errors"

export async function deleteOldAvatar(userId: string, avatarUrl: string | null) {
  if (!avatarUrl) return

  try {
    const oldPath = new URL(avatarUrl).pathname.split("/").pop()
    if (!oldPath) return

    const { error: deleteError } = await supabase.storage
      .from("avatars")
      .remove([`${userId}/${oldPath}`])
    
    if (deleteError) {
      console.error("Error deleting old avatar:", deleteError)
      throw new StorageError("Failed to delete old avatar")
    }
  } catch (error) {
    if (error instanceof StorageError) throw error
    console.error("Error parsing old avatar URL:", error)
    throw new StorageError("Invalid avatar URL format")
  }
}

export async function uploadFile(
  bucket: string,
  path: string,
  file: File
): Promise<string> {
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false
    })

  if (uploadError) {
    console.error("Upload error:", uploadError)
    throw new StorageError(uploadError.message || "Failed to upload file")
  }

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)

  if (!data.publicUrl) {
    throw new StorageError("Failed to get public URL for uploaded file")
  }

  return data.publicUrl
}