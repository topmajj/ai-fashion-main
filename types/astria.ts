export interface FluxSettings {
  strength: number
  preserve_structure: boolean
  face_preservation?: "high" | "medium" | "low"
}

export interface AstriaFluxResponse {
  id: string
  status: "pending" | "processing" | "completed" | "failed"
  images?: string[]
  error?: string
  flux_settings?: FluxSettings
}
