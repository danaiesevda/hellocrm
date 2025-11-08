import { CrmLayout } from "@/components/crm-layout"
import { Settings, User, Bell, Shield, Database, Palette } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/theme-toggle"

export default function SettingsPage() {
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
                    defaultValue="Mohammed"
                    className="mt-1.5 bg-crm-bg border-crm-border text-crm-text-primary"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-crm-text-secondary">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    defaultValue="Ahmadi"
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
                  defaultValue="mohammed@company.com"
                  className="mt-1.5 bg-crm-bg border-crm-border text-crm-text-primary"
                />
              </div>
              <Button className="bg-crm-primary hover:bg-crm-primary-hover text-white">Save Changes</Button>
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
                  className="border-crm-border text-crm-text-secondary bg-transparent"
                >
                  Enabled
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
                  className="border-crm-border text-crm-text-secondary bg-transparent"
                >
                  Enabled
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
            <div className="space-y-4">
              <Button
                variant="outline"
                className="border-crm-border text-crm-text-primary hover:bg-crm-surface-elevated bg-transparent"
              >
                Change Password
              </Button>
              <Button
                variant="outline"
                className="border-crm-border text-crm-text-primary hover:bg-crm-surface-elevated bg-transparent"
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
              <Button
                variant="outline"
                className="border-crm-border text-crm-text-primary hover:bg-crm-surface-elevated bg-transparent"
              >
                Export All Data
              </Button>
              <Button
                variant="outline"
                className="border-crm-border text-crm-text-primary hover:bg-crm-surface-elevated bg-transparent"
              >
                Import Contacts
              </Button>
              <Separator className="bg-crm-border" />
              <Button
                variant="outline"
                className="border-crm-danger text-crm-danger hover:bg-crm-danger hover:text-white bg-transparent"
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
