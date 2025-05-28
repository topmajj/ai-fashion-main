import type React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface MaskImageUploadProps {
  onMaskUpload: (maskUrl: string) => void
}

export function MaskImageUpload({ onMaskUpload }: MaskImageUploadProps) {
  const [maskFile, setMaskFile] = useState<File | null>(null)

  const handleMaskUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setMaskFile(file)

      // Here you would typically upload the file to your server or a cloud storage service
      // and get back a URL. For this example, we're creating a local object URL.
      const maskUrl = URL.createObjectURL(file)
      onMaskUpload(maskUrl)
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="mask-upload">Upload Mask Image</Label>
      <Input id="mask-upload" type="file" accept="image/png,image/jpeg" onChange={handleMaskUpload} />
      {maskFile && (
        <div className="mt-2">
          <p>Mask file: {maskFile.name}</p>
          <img src={URL.createObjectURL(maskFile) || "/placeholder.svg"} alt="Mask Preview" className="mt-2 max-w-xs" />
        </div>
      )}
    </div>
  )
}
