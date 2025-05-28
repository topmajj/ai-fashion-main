// Simple logger implementation
export const logger = {
  info: (message: string) => {
    console.log(`[INFO] ${message}`)
  },
  warn: (message: string) => {
    console.warn(`[WARN] ${message}`)
  },
  error: (message: string) => {
    console.error(`[ERROR] ${message}`)
  },
}

export function logError(error: unknown, context?: string) {
  console.error(`Error ${context ? `in ${context}` : ""}:`, error)
  // You could also send this to a logging service
}
