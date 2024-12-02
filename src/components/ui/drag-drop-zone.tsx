import * as React from "react"
import { cn } from "@/lib/utils"

interface DragDropZoneProps extends React.HTMLAttributes<HTMLDivElement> {
  onFileSelect: (file: File) => void
  disabled?: boolean
  children?: React.ReactNode
}

export function DragDropZone({
  onFileSelect,
  disabled = false,
  className,
  children,
  ...props
}: DragDropZoneProps) {
  const [isDragging, setIsDragging] = React.useState(false)

  const handleDragOver = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) {
      setIsDragging(true)
    }
  }, [disabled])

  const handleDragLeave = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (disabled) return

    const file = e.dataTransfer.files[0]
    if (file) {
      onFileSelect(file)
    }
  }, [disabled, onFileSelect])

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "relative",
        isDragging && "after:absolute after:inset-0 after:bg-primary/20 after:rounded-full after:border-2 after:border-primary after:border-dashed",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}