"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Palette, BrainCircuit, Bell, Shield, Key, Loader2, Check } from "lucide-react"
import { updateUserSettings, updateUserProfile, updateUserPassword } from "./actions"

export function SettingsClient({ dbUser }: { dbUser: Record<string, unknown> | null }) {
  const [activeTab, setActiveTab] = useState("profile")
  const { theme, setTheme } = useTheme()
  const [name, setName] = useState((dbUser?.name as string) || "")
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  
  // Password State
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState("")

  // Parse db settings
  const settings = (dbUser?.settings as Record<string, unknown>) || {}
  const [strictMode, setStrictMode] = useState((settings?.strictMode as boolean) ?? true)
  const [voiceOutput, setVoiceOutput] = useState((settings?.voiceOutput as boolean) ?? false)
  const [notifyResume, setNotifyResume] = useState((settings?.notifyResume as boolean) ?? true)
  const [notifyScore, setNotifyScore] = useState((settings?.notifyScore as boolean) ?? true)

  // Initialize theme from db if not already matched
  useEffect(() => {
    if (settings?.theme && (settings.theme as string) !== theme) {
      setTheme(settings.theme as string)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSaveProfile = async () => {
    setIsSaving(true)
    await updateUserProfile(name)
    setIsSaving(false)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 2000)
  }

  const handleThemeChange = async (newTheme: string) => {
    setTheme(newTheme)
    await updateUserSettings({ theme: newTheme })
  }

  const handleTogglePref = async (key: string, value: boolean) => {
    if (key === 'strictMode') setStrictMode(value)
    if (key === 'voiceOutput') setVoiceOutput(value)
    if (key === 'notifyResume') setNotifyResume(value)
    if (key === 'notifyScore') setNotifyScore(value)
    await updateUserSettings({ [key]: value })
  }

  const tabs = [
    { id: "profile", label: "Profile", icon: <User className="w-4 h-4" /> },
    { id: "theme", label: "Theme", icon: <Palette className="w-4 h-4" /> },
    { id: "ai", label: "AI Preferences", icon: <BrainCircuit className="w-4 h-4" /> },
    { id: "notifications", label: "Notifications", icon: <Bell className="w-4 h-4" /> },
    { id: "security", label: "Security", icon: <Shield className="w-4 h-4" /> },
    { id: "account", label: "Account", icon: <Key className="w-4 h-4" /> }
  ]

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account preferences and application settings.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 space-y-1 flex-shrink-0">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors text-left font-medium ${
                activeTab === tab.id 
                  ? "bg-primary/10 text-primary border border-primary/20" 
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </aside>

        <main className="flex-1">
          {activeTab === "profile" && (
            <Card className="bg-card border-border shadow-sm">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Full Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Email Address</label>
                  <input type="email" disabled defaultValue={(dbUser?.email as string) || ""} className="w-full bg-background/50 border border-border rounded-md px-3 py-2 text-sm text-muted-foreground cursor-not-allowed" />
                  <p className="text-xs text-muted-foreground">Email address cannot be changed directly.</p>
                </div>
                <Button onClick={handleSaveProfile} disabled={isSaving} className="bg-primary text-primary-foreground hover:bg-primary/90 min-w-32">
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : saveSuccess ? <Check className="w-4 h-4" /> : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          )}

          {activeTab === "theme" && (
            <Card className="bg-card border-border shadow-sm">
              <CardHeader>
                <CardTitle>Appearance & Theme</CardTitle>
                <CardDescription>Customize the visual layout of the application.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div 
                    onClick={() => handleThemeChange('light')}
                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${theme === 'light' ? 'border-primary bg-primary/5' : 'border-border bg-background hover:border-muted-foreground/50'}`}
                  >
                    <div className="h-24 rounded-lg bg-gray-100 border border-gray-200 mb-3 shadow-inner p-2">
                       <div className="h-4 bg-white rounded shadow-sm w-1/2 mb-2" />
                       <div className="h-4 bg-blue-100 rounded shadow-sm w-full" />
                    </div>
                    <div className="text-center font-medium text-foreground">Light</div>
                  </div>
                  <div 
                    onClick={() => handleThemeChange('dark')}
                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${theme === 'dark' ? 'border-primary bg-primary/5' : 'border-border bg-background hover:border-muted-foreground/50'}`}
                  >
                    <div className="h-24 rounded-lg bg-black border border-gray-800 mb-3 shadow-inner p-2">
                       <div className="h-4 bg-gray-800 rounded shadow-sm w-1/2 mb-2" />
                       <div className="h-4 bg-blue-900/40 rounded shadow-sm w-full" />
                    </div>
                    <div className="text-center font-medium text-foreground">Dark</div>
                  </div>
                  <div 
                    onClick={() => handleThemeChange('system')}
                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${theme === 'system' ? 'border-primary bg-primary/5' : 'border-border bg-background hover:border-muted-foreground/50'}`}
                  >
                    <div className="h-24 rounded-lg bg-gradient-to-r from-gray-100 to-black border border-gray-500 mb-3 shadow-inner p-2 flex">
                       <div className="w-1/2 h-full bg-white/10 rounded-l-md border-r border-gray-500" />
                       <div className="w-1/2 h-full bg-black/10 rounded-r-md" />
                    </div>
                    <div className="text-center font-medium text-foreground">System Default</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "ai" && (
            <Card className="bg-card border-border shadow-sm">
              <CardHeader>
                <CardTitle>AI Preferences</CardTitle>
                <CardDescription>Adjust how the AI interviewer behaves during mocks.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border border-border p-4 rounded-lg bg-background">
                    <div>
                      <h4 className="font-medium text-foreground">Strict Mode Grading</h4>
                      <p className="text-sm text-muted-foreground">AI will penalize heavily for syntax errors and sub-optimal time complexities.</p>
                    </div>
                    <div onClick={() => handleTogglePref('strictMode', !strictMode)} className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${strictMode ? 'bg-primary' : 'bg-muted border border-border'}`}>
                       <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${strictMode ? 'right-1' : 'left-1 bg-muted-foreground'}`} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between border border-border p-4 rounded-lg bg-background">
                    <div>
                      <h4 className="font-medium text-foreground">Conversational Voice Output</h4>
                      <p className="text-sm text-muted-foreground">AI will synthesize spoken audio during interview sessions.</p>
                    </div>
                    <div onClick={() => handleTogglePref('voiceOutput', !voiceOutput)} className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${voiceOutput ? 'bg-primary' : 'bg-muted border border-border'}`}>
                       <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${voiceOutput ? 'right-1' : 'left-1 bg-muted-foreground'}`} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "notifications" && (
            <Card className="bg-card border-border shadow-sm">
              <CardHeader>
                <CardTitle>Notification Center</CardTitle>
                <CardDescription>Manage your email and in-app alerts.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <div>
                      <h4 className="font-medium text-foreground">Resume Analysis Complete</h4>
                      <p className="text-sm text-muted-foreground">Get notified when your resume finishes parsing.</p>
                    </div>
                    <div onClick={() => handleTogglePref('notifyResume', !notifyResume)} className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${notifyResume ? 'bg-primary' : 'bg-muted border border-border'}`}>
                       <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${notifyResume ? 'right-1' : 'left-1 bg-muted-foreground'}`} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <div>
                      <h4 className="font-medium text-foreground">Interview Score Reports</h4>
                      <p className="text-sm text-muted-foreground">Receive a summary email after every mock interview.</p>
                    </div>
                    <div onClick={() => handleTogglePref('notifyScore', !notifyScore)} className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${notifyScore ? 'bg-primary' : 'bg-muted border border-border'}`}>
                       <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${notifyScore ? 'right-1' : 'left-1 bg-muted-foreground'}`} />
                    </div>
                  </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "security" && (
            <Card className="bg-card border-border shadow-sm">
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Update your password and secure your account.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">New Password</label>
                    <input 
                      type="password" 
                      value={newPassword} 
                      onChange={(e) => setNewPassword(e.target.value)} 
                      className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none" 
                      placeholder="Enter new password"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Confirm Password</label>
                    <input 
                      type="password" 
                      value={confirmPassword} 
                      onChange={(e) => setConfirmPassword(e.target.value)} 
                      className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none" 
                      placeholder="Confirm new password"
                    />
                  </div>
                  {passwordMessage && (
                    <p className={`text-sm ${passwordMessage.includes('Success') ? 'text-green-500' : 'text-red-500'}`}>
                      {passwordMessage}
                    </p>
                  )}
                  <Button 
                    onClick={async () => {
                      if (!newPassword || newPassword !== confirmPassword) {
                        setPasswordMessage("Passwords do not match or are empty.")
                        return
                      }
                      if (newPassword.length < 6) {
                        setPasswordMessage("Password must be at least 6 characters.")
                        return
                      }
                      setIsChangingPassword(true)
                      setPasswordMessage("")
                      const res = await updateUserPassword(newPassword)
                      if (res.error) {
                        setPasswordMessage(res.error)
                      } else {
                        setPasswordMessage("Successfully updated password.")
                        setNewPassword("")
                        setConfirmPassword("")
                      }
                      setIsChangingPassword(false)
                    }} 
                    disabled={isChangingPassword} 
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {isChangingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update Password"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "account" && (
            <Card className="bg-red-500/5 border-red-500/20 shadow-sm">
              <CardHeader>
                <CardTitle className="text-red-500">Danger Zone</CardTitle>
                <CardDescription className="text-red-400/80">Account deletion is handled manually.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">To permanently delete your account and all associated data, please contact support@interviewiq.ai.</p>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  )
}
