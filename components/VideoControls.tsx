"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

export function VideoControls() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [progress, setProgress] = useState(0)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const video = document.querySelector("video")
    if (video) {
      videoRef.current = video
      video.addEventListener("timeupdate", handleProgress)
      return () => video.removeEventListener("timeupdate", handleProgress)
    }
  }, [])

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleProgress = () => {
    if (videoRef.current) {
      const percent = (videoRef.current.currentTime / videoRef.current.duration) * 100
      setProgress(percent)
    }
  }

  const handleSeek = (newValue: number[]) => {
    if (videoRef.current) {
      const newTime = (newValue[0] / 100) * videoRef.current.duration
      videoRef.current.currentTime = newTime
      setProgress(newValue[0])
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={togglePlay}
        className="text-white hover:text-pink-200 hover:bg-pink-500/20"
      >
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMute}
        className="text-white hover:text-pink-200 hover:bg-pink-500/20"
      >
        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </Button>
      <Slider value={[progress]} max={100} step={0.1} onValueChange={handleSeek} className="w-full" />
    </div>
  )
}
