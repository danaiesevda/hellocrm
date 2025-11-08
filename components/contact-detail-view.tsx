"use client"
import {
  ArrowLeft,
  Mail,
  Phone,
  Video,
  Calendar,
  MoreHorizontal,
  ChevronDown,
  Building2,
  DollarSign,
  FileText,
  Paperclip,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export function ContactDetailView({ contactId }: { contactId: string }) {
  const contact = {
    id: "1",
    firstName: "Olly",
    lastName: "Topley",
    fullName: "Olly Topley",
    email: "olly.topley@shell.com",
    jobTitle: "Global Head of Insights at Shell",
    companyId: "shell",
    companyName: "Shell",
    companyDomain: "shell.com",
    phone: "--",
    mobilePhone: "--",
    streetAddress: "--",
    city: "--",
    stateRegion: "--",
    postalCode: "--",
    leadStatus: "--",
    lifecycleStage: "Opportunity",
    buyingRole: "--",
    owner: "Mohammed Ahmadi",
    avatar: "/professional-business-person.png",
    lastActivity: "Most recent activity shows a completed call with Olly T",
  }

  return (
    <div className="h-full flex flex-col bg-crm-bg">
      {/* Top Navigation Bar */}
      <div className="bg-crm-surface border-b border-crm-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/contacts" className="text-crm-text-secondary hover:text-crm-text-primary">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="text-crm-text-secondary">Contacts</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-crm-text-secondary border-crm-border hover:bg-crm-surface-elevated bg-transparent"
          >
            Actions
            <ChevronDown className="ml-1 w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-crm-text-secondary hover:bg-crm-surface-elevated">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Main Content - Three Column Layout */}
      <div className="flex-1 overflow-auto">
        <div className="flex gap-6 p-6 max-w-[1800px] mx-auto">
          {/* Left Sidebar - Key Information */}
          <div className="w-80 flex-shrink-0 space-y-4">
            {/* Contact Profile Card */}
            <div className="bg-crm-surface rounded-lg border border-crm-border p-6">
              <div className="flex items-start gap-4 mb-6">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={contact.avatar || "/placeholder.svg"} alt={contact.fullName} />
                  <AvatarFallback className="bg-crm-primary text-white text-lg">
                    {contact.firstName[0]}
                    {contact.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold text-crm-text-primary mb-1">{contact.fullName}</h2>
                  <p className="text-sm text-crm-text-secondary mb-1">{contact.jobTitle}</p>
                  <p className="text-sm text-crm-text-secondary flex items-center gap-1">{contact.email}</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-5 gap-2 mb-6">
                <button className="flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-crm-surface-elevated transition-colors group">
                  <div className="w-10 h-10 rounded-lg border border-crm-border flex items-center justify-center group-hover:border-crm-primary transition-colors">
                    <FileText className="w-5 h-5 text-crm-text-secondary group-hover:text-crm-primary" />
                  </div>
                  <span className="text-xs text-crm-text-secondary">Note</span>
                </button>
                <button className="flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-crm-surface-elevated transition-colors group">
                  <div className="w-10 h-10 rounded-lg border border-crm-border flex items-center justify-center group-hover:border-crm-primary transition-colors">
                    <Mail className="w-5 h-5 text-crm-text-secondary group-hover:text-crm-primary" />
                  </div>
                  <span className="text-xs text-crm-text-secondary">Email</span>
                </button>
                <button className="flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-crm-surface-elevated transition-colors group">
                  <div className="w-10 h-10 rounded-lg border border-crm-border flex items-center justify-center group-hover:border-crm-primary transition-colors">
                    <Phone className="w-5 h-5 text-crm-text-secondary group-hover:text-crm-primary" />
                  </div>
                  <span className="text-xs text-crm-text-secondary">Call</span>
                </button>
                <button className="flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-crm-surface-elevated transition-colors group">
                  <div className="w-10 h-10 rounded-lg border border-crm-border flex items-center justify-center group-hover:border-crm-primary transition-colors">
                    <Calendar className="w-5 h-5 text-crm-text-secondary group-hover:text-crm-primary" />
                  </div>
                  <span className="text-xs text-crm-text-secondary">Task</span>
                </button>
                <button className="flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-crm-surface-elevated transition-colors group">
                  <div className="w-10 h-10 rounded-lg border border-crm-border flex items-center justify-center group-hover:border-crm-primary transition-colors">
                    <Video className="w-5 h-5 text-crm-text-secondary group-hover:text-crm-primary" />
                  </div>
                  <span className="text-xs text-crm-text-secondary">Meeting</span>
                </button>
              </div>

              <Separator className="bg-crm-border my-4" />

              {/* Key Information Fields */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-crm-text-primary">Key information</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-crm-text-secondary hover:bg-crm-surface-elevated h-auto p-1"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-crm-text-tertiary">Email</label>
                    <p className="text-sm text-crm-text-primary mt-0.5">{contact.email}</p>
                  </div>

                  <div>
                    <label className="text-xs text-crm-text-tertiary">Phone Number</label>
                    <p className="text-sm text-crm-text-secondary mt-0.5">{contact.phone}</p>
                  </div>

                  <div>
                    <label className="text-xs text-crm-text-tertiary">Mobile Phone Number</label>
                    <p className="text-sm text-crm-text-secondary mt-0.5">{contact.mobilePhone}</p>
                  </div>

                  <div>
                    <label className="text-xs text-crm-text-tertiary">Company Name</label>
                    <p className="text-sm text-crm-text-secondary mt-0.5">{contact.companyName}</p>
                  </div>

                  <div>
                    <label className="text-xs text-crm-text-tertiary">Lead Status</label>
                    <p className="text-sm text-crm-text-secondary mt-0.5">{contact.leadStatus}</p>
                  </div>

                  <div>
                    <label className="text-xs text-crm-text-tertiary">Lifecycle Stage</label>
                    <p className="text-sm text-crm-text-primary mt-0.5">{contact.lifecycleStage}</p>
                  </div>

                  <div>
                    <label className="text-xs text-crm-text-tertiary">Buying Role</label>
                    <p className="text-sm text-crm-text-secondary mt-0.5">{contact.buyingRole}</p>
                  </div>

                  <div>
                    <label className="text-xs text-crm-text-tertiary">Contact owner</label>
                    <p className="text-sm text-crm-text-primary mt-0.5">{contact.owner}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Center Content Area */}
          <div className="flex-1 min-w-0 space-y-4">
            {/* Tabs */}
            <Tabs defaultValue="about" className="w-full">
              <div className="bg-crm-surface rounded-t-lg border border-crm-border border-b-0">
                <TabsList className="w-full justify-start bg-transparent h-12 p-0 border-b border-crm-border">
                  <TabsTrigger
                    value="about"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-crm-primary data-[state=active]:bg-transparent data-[state=active]:text-crm-text-primary px-6"
                  >
                    About
                  </TabsTrigger>
                  <TabsTrigger
                    value="activities"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-crm-primary data-[state=active]:bg-transparent data-[state=active]:text-crm-text-primary px-6"
                  >
                    Activities
                  </TabsTrigger>
                  <TabsTrigger
                    value="revenue"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-crm-primary data-[state=active]:bg-transparent data-[state=active]:text-crm-text-primary px-6"
                  >
                    Revenue
                  </TabsTrigger>
                  <TabsTrigger
                    value="intelligence"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-crm-primary data-[state=active]:bg-transparent data-[state=active]:text-crm-text-primary px-6"
                  >
                    Intelligence
                  </TabsTrigger>
                  <div className="ml-auto px-4 flex items-center">
                    <Button variant="ghost" size="sm" className="text-crm-text-secondary hover:bg-crm-surface-elevated">
                      Customize
                    </Button>
                  </div>
                </TabsList>
              </div>

              <TabsContent value="about" className="mt-0">
                <div className="bg-crm-surface rounded-b-lg border border-crm-border p-6 space-y-6">
                  {/* Breeze Record Summary */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-base font-semibold text-crm-text-primary">Breeze record summary</h3>
                      <Badge variant="secondary" className="bg-crm-primary text-white text-xs">
                        Beta
                      </Badge>
                    </div>
                    <p className="text-sm text-crm-text-secondary mb-3">{contact.lastActivity}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-crm-text-secondary border-crm-border hover:bg-crm-surface-elevated bg-transparent"
                    >
                      + Ask a question
                    </Button>
                  </div>

                  <Separator className="bg-crm-border" />

                  {/* Contact Profile Section */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-semibold text-crm-text-primary">Contact profile</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                      <div>
                        <label className="text-xs text-crm-text-tertiary">Company name</label>
                        <p className="text-sm text-crm-text-secondary mt-1">{contact.companyName}</p>
                      </div>
                      <div>
                        <label className="text-xs text-crm-text-tertiary">Street address</label>
                        <p className="text-sm text-crm-text-secondary mt-1">{contact.streetAddress}</p>
                      </div>
                      <div>
                        <label className="text-xs text-crm-text-tertiary">City</label>
                        <p className="text-sm text-crm-text-secondary mt-1">{contact.city}</p>
                      </div>
                      <div>
                        <label className="text-xs text-crm-text-tertiary">Postal code</label>
                        <p className="text-sm text-crm-text-secondary mt-1">{contact.postalCode}</p>
                      </div>
                      <div>
                        <label className="text-xs text-crm-text-tertiary">State/Region</label>
                        <p className="text-sm text-crm-text-secondary mt-1">{contact.stateRegion}</p>
                      </div>
                      <div>
                        <label className="text-xs text-crm-text-tertiary">Email</label>
                        <p className="text-sm text-crm-text-primary mt-1">{contact.email}</p>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-crm-border" />

                  {/* Enrollments Section */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-semibold text-crm-text-primary">Enrollments</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-crm-text-secondary hover:bg-crm-surface-elevated h-auto p-1"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-crm-text-primary mb-2">Communication subscriptions</h4>
                      <p className="text-sm text-crm-text-secondary mb-3">
                        Use subscription types to manage the communications this contact receives from you
                      </p>
                      <Button variant="link" className="text-crm-primary hover:text-crm-primary-hover p-0 h-auto">
                        View subscriptions
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="activities">
                <div className="bg-crm-surface rounded-b-lg border border-crm-border p-6">
                  <p className="text-crm-text-secondary">Activity timeline will appear here</p>
                </div>
              </TabsContent>

              <TabsContent value="revenue">
                <div className="bg-crm-surface rounded-b-lg border border-crm-border p-6">
                  <p className="text-crm-text-secondary">Revenue information will appear here</p>
                </div>
              </TabsContent>

              <TabsContent value="intelligence">
                <div className="bg-crm-surface rounded-b-lg border border-crm-border p-6">
                  <p className="text-crm-text-secondary">Intelligence insights will appear here</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar - Associated Records */}
          <div className="w-80 flex-shrink-0 space-y-4">
            {/* Companies */}
            <div className="bg-crm-surface rounded-lg border border-crm-border">
              <div className="p-4 border-b border-crm-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-crm-text-secondary" />
                  <h3 className="text-sm font-medium text-crm-text-primary">Companies (1)</h3>
                </div>
                <Button size="sm" variant="ghost" className="text-crm-primary hover:bg-crm-surface-elevated h-auto p-1">
                  +Add
                </Button>
              </div>
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-crm-primary/20 flex items-center justify-center text-crm-primary font-medium text-sm flex-shrink-0">
                    S
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-crm-text-primary">{contact.companyName}</span>
                      <Badge variant="outline" className="text-xs border-crm-border text-crm-text-secondary">
                        Primary
                      </Badge>
                    </div>
                    <p className="text-xs text-crm-text-secondary mt-1">Company Domain Name: {contact.companyDomain}</p>
                    <p className="text-xs text-crm-text-secondary">Phone: {contact.phone}</p>
                    <Button
                      variant="link"
                      className="text-crm-primary hover:text-crm-primary-hover p-0 h-auto text-xs mt-2"
                    >
                      Add association label
                    </Button>
                  </div>
                </div>
                <Button
                  variant="link"
                  className="text-crm-primary hover:text-crm-primary-hover p-0 h-auto text-sm mt-4 w-full justify-start"
                >
                  View all associated Companies →
                </Button>
              </div>
            </div>

            {/* Deals */}
            <div className="bg-crm-surface rounded-lg border border-crm-border">
              <div className="p-4 border-b border-crm-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-crm-text-secondary" />
                  <h3 className="text-sm font-medium text-crm-text-primary">Deals (0)</h3>
                </div>
                <Button size="sm" variant="ghost" className="text-crm-primary hover:bg-crm-surface-elevated h-auto p-1">
                  +Add
                </Button>
              </div>
              <div className="p-6 text-center">
                <div className="w-24 h-24 mx-auto mb-4 opacity-50">
                  <svg viewBox="0 0 100 100" className="text-crm-text-tertiary">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" />
                    <path d="M 30 50 L 45 65 L 70 35" fill="none" stroke="currentColor" strokeWidth="3" />
                  </svg>
                </div>
                <p className="text-sm text-crm-text-secondary mb-1">
                  Track the revenue opportunities associated with this record.
                </p>
              </div>
            </div>

            {/* Tickets */}
            <div className="bg-crm-surface rounded-lg border border-crm-border">
              <div className="p-4 border-b border-crm-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-crm-text-secondary" />
                  <h3 className="text-sm font-medium text-crm-text-primary">Tickets (0)</h3>
                </div>
                <Button size="sm" variant="ghost" className="text-crm-primary hover:bg-crm-surface-elevated h-auto p-1">
                  +Add
                </Button>
              </div>
              <div className="p-6 text-center">
                <div className="w-24 h-24 mx-auto mb-4 opacity-50">
                  <svg viewBox="0 0 100 100" className="text-crm-text-tertiary">
                    <rect
                      x="25"
                      y="25"
                      width="50"
                      height="50"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      rx="5"
                    />
                    <line x1="35" y1="40" x2="65" y2="40" stroke="currentColor" strokeWidth="2" />
                    <line x1="35" y1="50" x2="65" y2="50" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </div>
                <p className="text-sm text-crm-text-secondary mb-1">
                  Track the customer requests associated with this record.
                </p>
              </div>
            </div>

            {/* Attachments */}
            <div className="bg-crm-surface rounded-lg border border-crm-border">
              <div className="p-4 border-b border-crm-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Paperclip className="w-4 h-4 text-crm-text-secondary" />
                  <h3 className="text-sm font-medium text-crm-text-primary">Attachments</h3>
                </div>
                <Button size="sm" variant="ghost" className="text-crm-primary hover:bg-crm-surface-elevated h-auto p-1">
                  Add
                </Button>
              </div>
              <div className="p-6 text-center">
                <p className="text-sm text-crm-text-secondary">
                  See the files attached to your activities or uploaded to this record.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
