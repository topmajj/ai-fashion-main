"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PromptGeneratorProps {
  onGenerate: (prompt: string) => void
}

export function PromptGenerator({ onGenerate }: PromptGeneratorProps) {
  const [bodyType, setBodyType] = useState("")
  const [pose, setPose] = useState("")
  const [lighting, setLighting] = useState("")
  const [customPrompt, setCustomPrompt] = useState("")

  const generatePrompt = () => {
    let prompt = `Generate a realistic virtual try-on image with the following characteristics:`
    if (bodyType) prompt += ` Body type: ${bodyType}.`
    if (pose) prompt += ` Pose: ${pose}.`
    if (lighting) prompt += ` Lighting: ${lighting}.`
    if (customPrompt) prompt += ` ${customPrompt}`
    onGenerate(prompt.trim())
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="body-type">Body Type</Label>
        <Select value={bodyType} onValueChange={setBodyType}>
          <SelectTrigger id="body-type">
            <SelectValue placeholder="Select body type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="slim">Slim</SelectItem>
            <SelectItem value="average">Average</SelectItem>
            <SelectItem value="curvy">Curvy</SelectItem>
            <SelectItem value="athletic">Athletic</SelectItem>
            <SelectItem value="plus-size">Plus Size</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="pose">Pose</Label>
        <Select value={pose} onValueChange={setPose}>
          <SelectTrigger id="pose">
            <SelectValue placeholder="Select pose" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="standing">Standing</SelectItem>
            <SelectItem value="sitting">Sitting</SelectItem>
            <SelectItem value="walking">Walking</SelectItem>
            <SelectItem value="casual">Casual</SelectItem>
            <SelectItem value="formal">Formal</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="lighting">Lighting</Label>
        <Select value={lighting} onValueChange={setLighting}>
          <SelectTrigger id="lighting">
            <SelectValue placeholder="Select lighting" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="natural">Natural</SelectItem>
            <SelectItem value="studio">Studio</SelectItem>
            <SelectItem value="soft">Soft</SelectItem>
            <SelectItem value="dramatic">Dramatic</SelectItem>
            <SelectItem value="outdoor">Outdoor</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="custom-prompt">Custom Prompt (Optional)</Label>
        <Input
          id="custom-prompt"
          placeholder="Add any additional details for the virtual try-on"
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
        />
      </div>
      <Button onClick={generatePrompt} className="w-full">
        Generate Prompt
      </Button>
    </div>
  )
}
