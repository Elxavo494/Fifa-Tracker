import { FileValidationError } from "@/lib/errors"

export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export function validateImageFile(file: File) {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    throw new FileValidationError("Please upload a JPG, JPEG, PNG, or WebP image.")
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new FileValidationError("Please upload an image smaller than 5MB.")
  }
}