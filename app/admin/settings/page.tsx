"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"

interface Settings {
  maintenance_mode: boolean
  default_credits: number
  max_credits_per_user: number
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings>({
    maintenance_mode: false,
    default_credits: 0,
    max_credits_per_user: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("settings").select("*").single()

      if (error) throw error
      setSettings(data)
    } catch (error) {
      console.error("Error fetching settings:", error)
      toast({
        title: "Error",
        description: "Failed to fetch settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateSettings = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.from("settings").update(settings).eq("id", 1) // Assuming there's only one row in the settings table

      if (error) throw error

      toast({
        title: "Success",
        description: "Settings updated successfully.",
      })
    } catch (error) {
      console.error("Error updating settings:", error)
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Settings</h1>
        <p className="text-gray-600">Configure global settings for the platform</p>
      </div>

      {loading ? (
        <p>Loading settings...</p>
      ) : (
        <Card className="p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
              <Switch
                id="maintenance-mode"
                checked={settings.maintenance_mode}
                onCheckedChange={(checked) => setSettings({ ...settings, maintenance_mode: checked })}
              />
            </div>

            <div>
              <Label htmlFor="default-credits">Default Credits for New Users</Label>
              <Input
                id="default-credits"
                type="number"
                value={settings.default_credits}
                onChange={(e) => setSettings({ ...settings, default_credits: Number.parseInt(e.target.value) })}
              />
            </div>

            <div>
              <Label htmlFor="max-credits">Maximum Credits per User</Label>
              <Input
                id="max-credits"
                type="number"
                value={settings.max_credits_per_user}
                onChange={(e) => setSettings({ ...settings, max_credits_per_user: Number.parseInt(e.target.value) })}
              />
            </div>

            <Button onClick={updateSettings} disabled={loading}>
              Save Settings
            </Button>
          </div>
        </Card>
      )}
    </AdminLayout>
  )
}
