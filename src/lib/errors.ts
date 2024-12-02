export class FileValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "FileValidationError"
  }
}

export class StorageError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "StorageError"
  }
}