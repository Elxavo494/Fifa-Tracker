import { ChangeEvent } from "react"
import { Camera, Loader2, Upload } from "lucide-react"
import { Input } from "@/components/ui/input"
import { DragDropZone } from "@/components/ui/drag-drop-zone"
import { useAvatarUpload } from "./use-avatar-upload"
import { ACCEPTED_IMAGE_TYPES } from "@/lib/validators/file"

interface AvatarUploadProps {
  userId: string
  onUploadComplete: (url: string) => Promise<void>
}

export function AvatarUpload({ userId, onUploadComplete }: AvatarUploadProps) {
  const { uploadAvatar, isUploading } = useAvatarUpload()

  const handleFileSelect = async (file: File) => {
    try {
      const newAvatarUrl = await uploadAvatar(file, userId)
      await onUploadComplete(newAvatarUrl)
    } catch (error) {
      // Error handling is done in useAvatarUpload
    }
  }

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    await handleFileSelect(file)
    e.target.value = ""
  }

  return (
    <DragDropZone
      onFileSelect={handleFileSelect}
      disabled={isUploading}
      className="absolute inset-0"
    >
      <label 
        className={`absolute inset-0 flex items-center justify-center bg-black/50 text-white transition-opacity rounded-full cursor-pointer ${isUploading ? 'opacity-100' : 'opacity-0 hover:opacity-100'}`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            e.currentTarget.click()
          }
        }}
      >
        {isUploading ? (
          <Loader2 className="h-6 w-6 animate-spin" />
        ) : (
          <div className="flex flex-col items-center gap-1">
            <Camera className="h-6 w-6" />
            <Upload className="h-4 w-4 opacity-75" />
          </div>
        )}
        <Input
          type="file"
          className="hidden"
          accept={ACCEPTED_IMAGE_TYPES.join(",")}
          onChange={handleChange}
          disabled={isUploading}
        />
      </label>
    </DragDropZone>
  )
}