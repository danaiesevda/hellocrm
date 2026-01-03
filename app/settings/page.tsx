"use client"

import { CrmLayout } from "@/components/crm-layout"
import { Settings, User, Bell, Shield, Database, Palette } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/theme-toggle"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function SettingsPage() {
  const router = useRouter()
  const [firstName, setFirstName] = useState("Sevda")
  const [lastName, setLastName] = useState("Danaie")
  const [email, setEmail] = useState("sevda@company.com")
  const [isSaving, setIsSaving] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [dealUpdates, setDealUpdates] = useState(true)

  useEffect(() => {
    // Load current user data
    async function loadUserData() {
      try {
        const response = await fetch("/api/data")
        if (response.ok) {
          const data = await response.json()
          const user = data.users?.find((u: any) => u.id === "sevda-danaie")
          if (user) {
            const nameParts = user.name?.split(" ") || []
            setFirstName(nameParts[0] || "Sevda")
            setLastName(nameParts.slice(1).join(" ") || "Danaie")
            setEmail(user.email || "sevda@company.com")
          }
        }
      } catch (error) {
        console.error("Error loading user data:", error)
      }
    }
    loadUserData()
  }, [])

  const handleSaveProfile = async () => {
    setIsSaving(true)
    try {
      const fullName = `${firstName} ${lastName}`.trim()
      const initials = `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase() || "SD"

      const response = await fetch("/api/data", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "user",
          id: "sevda-danaie",
          name: fullName,
          email: email,
          initials: initials,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to save settings")
      }

      toast.success("Settings saved successfully!")
      
      // Force a full page reload to update all components
      setTimeout(() => {
        window.location.reload()
      }, 500)
    } catch (error: any) {
      console.error("Error saving settings:", error)
      toast.error(error.message || "Failed to save settings")
    } finally {
      setIsSaving(false)
    }
  }
  return (
    <CrmLayout>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="w-6 h-6 text-crm-primary" />
          <h1 className="text-2xl font-semibold text-crm-text-primary">Settings</h1>
        </div>

        <div className="max-w-4xl space-y-6">
          {/* Appearance */}
          <Card className="bg-crm-surface border-crm-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <Palette className="w-5 h-5 text-crm-primary" />
              <h2 className="text-lg font-semibold text-crm-text-primary">Appearance</h2>
            </div>
            <div className="space-y-3">
              <ThemeToggle />
            </div>
          </Card>

          {/* User Profile */}
          <Card className="bg-crm-surface border-crm-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-5 h-5 text-crm-primary" />
              <h2 className="text-lg font-semibold text-crm-text-primary">User Profile</h2>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-crm-text-secondary">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="mt-1.5 bg-crm-bg border-crm-border text-crm-text-primary"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-crm-text-secondary">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="mt-1.5 bg-crm-bg border-crm-border text-crm-text-primary"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email" className="text-crm-text-secondary">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5 bg-crm-bg border-crm-border text-crm-text-primary"
                />
              </div>
              <Button 
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="bg-crm-primary hover:bg-crm-primary-hover text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </Card>

          {/* Notifications */}
          <Card className="bg-crm-surface border-crm-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-5 h-5 text-crm-primary" />
              <h2 className="text-lg font-semibold text-crm-text-primary">Notifications</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-crm-text-primary">Email notifications</p>
                  <p className="text-xs text-crm-text-secondary">Receive email updates about activities</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEmailNotifications(!emailNotifications)}
                  className={`border-crm-border bg-transparent cursor-pointer ${
                    emailNotifications 
                      ? "text-crm-text-secondary" 
                      : "text-crm-text-tertiary"
                  }`}
                >
                  {emailNotifications ? "Enabled" : "Disabled"}
                </Button>
              </div>
              <Separator className="bg-crm-border" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-crm-text-primary">Deal updates</p>
                  <p className="text-xs text-crm-text-secondary">Get notified when deals change stage</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDealUpdates(!dealUpdates)}
                  className={`border-crm-border bg-transparent cursor-pointer ${
                    dealUpdates 
                      ? "text-crm-text-secondary" 
                      : "text-crm-text-tertiary"
                  }`}
                >
                  {dealUpdates ? "Enabled" : "Disabled"}
                </Button>
              </div>
            </div>
          </Card>

          {/* Security */}
          <Card className="bg-crm-surface border-crm-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-crm-primary" />
              <h2 className="text-lg font-semibold text-crm-text-primary">Security</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="border-crm-border text-crm-text-primary hover:bg-crm-surface-elevated bg-transparent cursor-pointer"
              >
                Change Password
              </Button>
              <Button
                variant="outline"
                className="border-crm-border text-crm-text-primary hover:bg-crm-surface-elevated bg-transparent cursor-pointer"
              >
                Enable Two-Factor Authentication
              </Button>
            </div>
          </Card>

          {/* Data Management */}
          <Card className="bg-crm-surface border-crm-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-5 h-5 text-crm-primary" />
              <h2 className="text-lg font-semibold text-crm-text-primary">Data Management</h2>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="border-crm-border text-crm-text-primary hover:bg-crm-surface-elevated bg-transparent cursor-pointer"
                >
                  Export All Data
                </Button>
                <Button
                  variant="outline"
                  className="border-crm-border text-crm-text-primary hover:bg-crm-surface-elevated bg-transparent cursor-pointer"
                >
                  Import Contacts
                </Button>
              </div>
              <Separator className="bg-crm-border" />
              <Button
                variant="outline"
                className="border-crm-border text-crm-text-primary hover:bg-crm-surface-elevated bg-transparent cursor-pointer"
              >
                Delete All Data
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </CrmLayout>
  )
}
