"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
// import { useDropzone } from 'react-dropzone'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Upload } from 'lucide-react'
import { useUser } from "@/lib/use-user"
import { ProtectedRoute } from "@/components/protected-route"
import { useLanguage } from "@/components/simple-language-switcher"

const supabase = createClientComponentClient()

export default function Settings() {
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [notifications, setNotifications] = useState(true)
  const [newsletter, setNewsletter] = useState(false)
  const [language, setLanguage] = useState("en")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [changePasswordButtonText, setChangePasswordButtonText] = useState("Change Password")
  //  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const router = useRouter()
  const { user, loading: userLoading } = useUser()
  const { t, isRTL } = useLanguage()

  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/login")
    } else if (user) {
      getProfile()
    }
  }, [user, userLoading, router])

  //  const onDrop = useCallback((acceptedFiles: File[]) => {
  //   if (acceptedFiles[0]) {
  //     setAvatarFile(acceptedFiles[0])
  //     setAvatarUrl(URL.createObjectURL(acceptedFiles[0]))
  //   }
  // }, [])

  // const { getRootProps, getInputProps, isDragActive } = useDropzone({
  //  onDrop,
  //  accept: {'image/*': []},
  //  maxFiles: 1
  // })

  // useEffect(() => {
  //   getProfile()
  // }, [])

  async function getProfile() {
    try {
      setLoading(true)
      if (!user) {
        throw new Error("No authenticated user")
      }

      const { data, error } = await supabase.from("users").select(`name, avatar_url`).eq("id", user.id).single()

      if (error) throw error

      setName(data?.name || "")
      setAvatarUrl(data?.avatar_url || "")
      setEmail(user.email || "")

      const { data: settings, error: settingsError } = await supabase
        .from("user_settings")
        .select(`notifications_enabled, newsletter_subscribed, language`)
        .eq("id", user.id)
        .single()

      if (settingsError) throw settingsError

      if (settings) {
        setNotifications(settings.notifications_enabled)
        setNewsletter(settings.newsletter_subscribed)
        setLanguage(settings.language)
      }
    } catch (error) {
      console.error("Error loading user data:", error)
      toast({
        title: "Error",
        description: "Failed to load user data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile() {
    try {
      setLoading(true)
      if (!user) {
        throw new Error("No authenticated user")
      }

      const updates = {
        id: user.id,
        name,
        avatar_url: avatarUrl,
        email,
      }

      const { error: userError } = await supabase.from("users").upsert(updates)
      if (userError) throw userError

      if (email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({ email })
        if (emailError) throw emailError
      }

      const settingsUpdates = {
        id: user.id,
        notifications_enabled: notifications,
        newsletter_subscribed: newsletter,
        language,
      }

      const { error: settingsError } = await supabase.from("user_settings").upsert(settingsUpdates)
      if (settingsError) throw settingsError

      toast({
        title: "Success",
        description: "Profile updated successfully!",
      })

      // Refresh the user data in the UI
      await getProfile()
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function changePassword() {
    try {
      setLoading(true)
      setChangePasswordButtonText("Changing Password...")
      if (!user) {
        throw new Error("No authenticated user")
      }

      if (newPassword !== confirmPassword) {
        throw new Error("New passwords do not match")
      }

      // First, sign in with the current password to verify it
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      })

      if (signInError) {
        throw new Error("Current password is incorrect")
      }

      // If sign-in successful, update the password
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) throw error

      toast({
        title: "Success",
        description: "Password updated successfully!",
      })

      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error) {
      console.error("Error changing password:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to change password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setChangePasswordButtonText("Change Password")
    }
  }

  // async function uploadAvatar(file: File): Promise<string | null> {
  //   try {
  //     const fileExt = file.name.split('.').pop()
  //     const fileName = `${user?.id}${Math.random()}.${fileExt}`
  //     const { data, error } = await supabase.storage
  //       .from('avatars')
  //       .upload(fileName, file, {
  //         upsert: true,
  //         cacheControl: '3600',
  //         contentType: file.type
  //       })

  //     if (error) throw error

  //     const { data: { publicUrl }, error: urlError } = supabase.storage
  //       .from('avatars')
  //       .getPublicUrl(data.path)

  //     if (urlError) throw urlError

  //     return publicUrl
  //   } catch (error) {
  //     console.error('Error uploading avatar:', error)
  //     toast({
  //       title: "Avatar upload failed",
  //       description: error.message || "Failed to upload avatar. Please try again.",
  //       variant: "destructive",
  //     })
  //     return null
  //   }
  // }

  const updates = { id: user?.id || "" }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="container mx-auto px-4 py-8" dir={isRTL ? "rtl" : "ltr"}>
          <Card className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">{t("settings.title")}</h1>
            <div className="space-y-6">
              <div>
                <Label htmlFor="name">{t("common.name")}</Label>
                <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="email">{t("common.email")}</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="avatar">{t("settings.profilePicture")}</Label>
                <div className="mt-1 flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage
                      src={avatarUrl || `https://api.dicebear.com/6.x/avataaars/svg?seed=${name}`}
                      alt="Profile"
                    />
                    <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <Button
                    onClick={() => setAvatarUrl(`https://api.dicebear.com/6.x/avataaars/svg?seed=${Math.random()}`)}
                  >
                    {t("settings.generateRandomAvatar")}
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications">{t("settings.notifications")}</Label>
                <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="newsletter">{t("settings.newsletter")}</Label>
                <Switch id="newsletter" checked={newsletter} onCheckedChange={setNewsletter} />
              </div>
              <div>
                <Label htmlFor="language">{t("common.language")}</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="border-t pt-6 mt-6">
                <h2 className="text-xl font-semibold mb-4">{t("settings.changePassword")}</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">{t("auth.currentPassword")}</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="newPassword">{t("auth.newPassword")}</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">{t("auth.confirmPassword")}</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button
                    onClick={changePassword}
                    disabled={loading || !currentPassword || !newPassword || !confirmPassword}
                  >
                    {t(
                      changePasswordButtonText === "Change Password"
                        ? "settings.changePassword"
                        : "settings.changingPassword",
                    )}
                  </Button>
                </div>
              </div>
              <Button onClick={updateProfile} disabled={userLoading || loading}>
                {userLoading || loading ? t("settings.updating") : t("settings.updateProfile")}
              </Button>
            </div>
          </Card>
        </div>
      </Layout>
    </ProtectedRoute>
  )
}
