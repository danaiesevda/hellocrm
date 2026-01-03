"use client"

import type React from "react"
import { Home, Users, Building2, TrendingUp, Ticket, BarChart3, Settings, Search, Bell, HelpCircle, Mail, DollarSign, LogOut, Sparkles } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Contacts", href: "/contacts", icon: Users },
  { name: "Companies", href: "/companies", icon: Building2 },
  { name: "Deals", href: "/deals", icon: TrendingUp },
  { name: "Tickets", href: "/tickets", icon: Ticket },
  { name: "Reports", href: "/reports", icon: BarChart3 },
]

export function CrmLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [profileOpen, setProfileOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [userData, setUserData] = useState<{ name: string; email: string; initials: string } | null>(null)
  const [searchResults, setSearchResults] = useState<{
    contacts: any[]
    companies: any[]
    deals: any[]
    tickets: any[]
  }>({
    contacts: [],
    companies: [],
    deals: [],
    tickets: [],
  })

  // Mock notifications data
  const [notifications] = useState([
    {
      id: "1",
      title: "New deal created",
      message: "Apple Renewal Contract deal was created",
      time: "2 minutes ago",
      read: false,
      type: "deal"
    },
    {
      id: "2",
      title: "Contact updated",
      message: "Layla Cooper's information was updated",
      time: "15 minutes ago",
      read: false,
      type: "contact"
    },
    {
      id: "3",
      title: "Ticket assigned",
      message: "You were assigned to ticket #1234",
      time: "1 hour ago",
      read: true,
      type: "ticket"
    },
    {
      id: "4",
      title: "Company added",
      message: "New company Microsoft was added",
      time: "2 hours ago",
      read: true,
      type: "company"
    }
  ])

  const unreadCount = notifications.filter(n => !n.read).length

  useEffect(() => {
    setMounted(true)
  }, [])

  // Keyboard shortcut for search (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
      if (e.key === 'Escape') {
        setSearchOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Load user data
  useEffect(() => {
    async function loadUserData() {
      try {
        const response = await fetch("/api/data")
        if (response.ok) {
          const data = await response.json()
          const user = data.users?.find((u: any) => u.id === "sevda-danaie")
          if (user) {
            setUserData({
              name: user.name || "Sevda Danaie",
              email: user.email || "sevda@company.com",
              initials: user.initials || "SD",
            })
          } else {
            setUserData({
              name: "Sevda Danaie",
              email: "sevda@company.com",
              initials: "SD",
            })
          }
        }
      } catch (error) {
        console.error("Error loading user data:", error)
        setUserData({
          name: "Sevda Danaie",
          email: "sevda@company.com",
          initials: "SD",
        })
      }
    }
    loadUserData()
  }, [])

  // Load search data
  useEffect(() => {
    if (searchOpen) {
      async function loadSearchData() {
        try {
          const response = await fetch("/api/data")
          if (response.ok) {
            const data = await response.json()
            setSearchResults({
              contacts: data.contacts || [],
              companies: data.companies || [],
              deals: data.deals || [],
              tickets: data.tickets || [],
            })
          }
        } catch (error) {
          console.error("Error loading search data:", error)
        }
      }
      loadSearchData()
    }
  }, [searchOpen])

  // Filter search results
  const filteredResults = {
    contacts: searchResults.contacts.filter(
      (contact) =>
        !searchQuery ||
        `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    companies: searchResults.companies.filter(
      (company) =>
        !searchQuery ||
        company.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.domain?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.industry?.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    deals: searchResults.deals.filter(
      (deal) =>
        !searchQuery ||
        deal.name?.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    tickets: searchResults.tickets.filter(
      (ticket) =>
        !searchQuery ||
        ticket.title?.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  }

  const totalResults =
    filteredResults.contacts.length +
    filteredResults.companies.length +
    filteredResults.deals.length +
    filteredResults.tickets.length

  // Determine which logo to use based on theme
  const logoSrc = mounted && theme === "dark" ? "/hello-white.png" : "/hello-black.png"

  return (
    <div className="flex h-screen bg-crm-bg">
      {/* Left Sidebar */}
      <div className="w-20 bg-crm-surface border-r border-crm-border flex flex-col items-center pt-1 pb-4 gap-6">
        {/* Logo */}
        <Link href="/" className="w-12 h-12 flex items-center justify-center hover:opacity-80 transition-opacity cursor-pointer" style={{ marginTop: '10px' }}>
          {mounted ? (
            <Image
              src={logoSrc}
              alt="HelloCRM"
              width={48}
              height={48}
              className="object-contain"
              priority
            />
          ) : (
            <div className="w-10 h-10 bg-crm-primary rounded-lg flex items-center justify-center text-white font-bold text-lg">
              C
            </div>
          )}
        </Link>

        {/* Navigation Icons */}
        <nav className="flex flex-col gap-4 flex-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center transition-colors cursor-pointer",
                  isActive
                    ? "bg-crm-primary text-white"
                    : "text-crm-text-secondary hover:bg-crm-surface-elevated hover:text-crm-text-primary",
                )}
                title={item.name}
              >
                <item.icon className="w-5 h-5" />
              </Link>
            )
          })}
        </nav>

        {/* Bottom Settings */}
        <Link
          href="/settings"
          className="w-10 h-10 rounded-lg flex items-center justify-center text-crm-text-secondary hover:bg-crm-surface-elevated hover:text-crm-text-primary transition-colors cursor-pointer"
          title="Settings"
        >
          <Settings className="w-5 h-5" />
        </Link>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-14 bg-crm-surface border-b border-crm-border flex items-center justify-between px-6 gap-4">
          {/* Search Bar */}
          <Popover open={searchOpen} onOpenChange={(open) => {
            setSearchOpen(open)
            if (!open) {
              setSearchQuery("")
            }
          }}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="flex-1 max-w-2xl h-9 px-4 py-2 justify-start text-left font-normal bg-crm-surface border border-crm-border-light rounded-md text-crm-text-secondary hover:bg-crm-surface-elevated hover:text-crm-text-primary transition-colors inline-flex items-center gap-2 cursor-pointer"
              >
                <Search className="h-4 w-4 text-crm-text-tertiary" />
                <span className="text-crm-text-tertiary">Search...</span>
                <kbd className="ml-auto pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-crm-surface-elevated px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-[600px] p-0 bg-crm-surface border-crm-border" align="start" sideOffset={5} style={{ backgroundColor: 'var(--color-crm-surface)', opacity: 1 }}>
              <Command className="bg-crm-surface" shouldFilter={false} style={{ backgroundColor: 'var(--color-crm-surface)' }}>
                <CommandInput
                  placeholder="Search contacts, companies, deals, tickets..."
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                  className="bg-crm-surface border-crm-border text-crm-text-primary cursor-text"
                  style={{ backgroundColor: 'var(--color-crm-surface)' }}
                />
                <CommandList className="max-h-[400px] bg-crm-surface" style={{ backgroundColor: 'var(--color-crm-surface)' }}>
                  <CommandEmpty className="py-6 text-center text-sm text-crm-text-secondary bg-crm-surface" style={{ backgroundColor: 'var(--color-crm-surface)' }}>
                    No results found.
                  </CommandEmpty>
                  {filteredResults.contacts.length > 0 && (
                    <CommandGroup heading="Contacts" className="bg-crm-surface" style={{ backgroundColor: 'var(--color-crm-surface)' }}>
                      {filteredResults.contacts.slice(0, 5).map((contact) => (
                        <CommandItem
                          key={contact.id}
                          onSelect={() => {
                            router.push(`/contacts/${contact.id}`)
                            setSearchOpen(false)
                            setSearchQuery("")
                          }}
                          className="text-crm-text-primary hover:bg-crm-surface-elevated cursor-pointer bg-crm-surface"
                          style={{ backgroundColor: 'var(--color-crm-surface)', cursor: 'pointer' }}
                        >
                          <Users className="mr-2 h-4 w-4 text-crm-primary" />
                          <span>
                            {contact.firstName} {contact.lastName}
                          </span>
                          {contact.email && (
                            <span className="ml-2 text-xs text-crm-text-secondary">
                              {contact.email}
                            </span>
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                  {filteredResults.companies.length > 0 && (
                    <CommandGroup heading="Companies" className="bg-crm-surface" style={{ backgroundColor: 'var(--color-crm-surface)' }}>
                      {filteredResults.companies.slice(0, 5).map((company) => (
                        <CommandItem
                          key={company.id}
                          onSelect={() => {
                            router.push(`/companies/${company.id}`)
                            setSearchOpen(false)
                            setSearchQuery("")
                          }}
                          className="text-crm-text-primary hover:bg-crm-surface-elevated cursor-pointer bg-crm-surface"
                          style={{ backgroundColor: 'var(--color-crm-surface)' }}
                        >
                          <Building2 className="mr-2 h-4 w-4 text-crm-success" />
                          <span>{company.name}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                  {filteredResults.deals.length > 0 && (
                    <CommandGroup heading="Deals" className="bg-crm-surface" style={{ backgroundColor: 'var(--color-crm-surface)' }}>
                      {filteredResults.deals.slice(0, 5).map((deal) => (
                        <CommandItem
                          key={deal.id}
                          onSelect={() => {
                            router.push(`/deals/${deal.id}`)
                            setSearchOpen(false)
                            setSearchQuery("")
                          }}
                          className="text-crm-text-primary hover:bg-crm-surface-elevated cursor-pointer bg-crm-surface"
                          style={{ backgroundColor: 'var(--color-crm-surface)' }}
                        >
                          <DollarSign className="mr-2 h-4 w-4 text-crm-warning" />
                          <span>{deal.name}</span>
                          {deal.amount && (
                            <span className="ml-2 text-xs text-crm-text-secondary">
                              ${deal.amount.toLocaleString()}
                            </span>
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                  {filteredResults.tickets.length > 0 && (
                    <CommandGroup heading="Tickets" className="bg-crm-surface" style={{ backgroundColor: 'var(--color-crm-surface)' }}>
                      {filteredResults.tickets.slice(0, 5).map((ticket) => (
                        <CommandItem
                          key={ticket.id}
                          onSelect={() => {
                            router.push(`/tickets/${ticket.id}`)
                            setSearchOpen(false)
                            setSearchQuery("")
                          }}
                          className="text-crm-text-primary hover:bg-crm-surface-elevated cursor-pointer bg-crm-surface"
                          style={{ backgroundColor: 'var(--color-crm-surface)' }}
                        >
                          <Ticket className="mr-2 h-4 w-4 text-crm-danger" />
                          <span>{ticket.title}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-crm-text-secondary hover:text-crm-text-primary hover:bg-crm-surface-elevated relative cursor-pointer"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-crm-primary rounded-full"></span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent 
                className="w-80 p-0 bg-crm-surface border-crm-border" 
                align="end"
                sideOffset={5}
                style={{ backgroundColor: 'var(--color-crm-surface)', opacity: 1 }}
              >
                <div className="p-4 border-b border-crm-border">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-crm-text-primary">Notifications</h3>
                    {unreadCount > 0 && (
                      <Badge variant="secondary" className="bg-crm-primary text-white text-xs">
                        {unreadCount} new
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-crm-text-secondary text-sm">
                      No notifications
                    </div>
                  ) : (
                    <div className="divide-y divide-crm-border">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 hover:bg-crm-surface-elevated transition-colors cursor-pointer ${
                            !notification.read ? 'bg-crm-surface-elevated/50' : ''
                          }`}
                          onClick={() => {
                            // Handle notification click
                            setNotificationsOpen(false)
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`mt-1 w-2 h-2 rounded-full ${
                              !notification.read ? 'bg-crm-primary' : 'bg-transparent'
                            }`} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-crm-text-primary">
                                {notification.title}
                              </p>
                              <p className="text-xs text-crm-text-secondary mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-crm-text-tertiary mt-1">
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {notifications.length > 0 && (
                  <div className="p-3 border-t border-crm-border">
                    <button
                      className="w-full text-sm text-crm-text-secondary hover:text-crm-text-primary text-center cursor-pointer"
                      onClick={() => setNotificationsOpen(false)}
                    >
                      Mark all as read
                    </button>
                  </div>
                )}
              </PopoverContent>
            </Popover>
            <button
              onClick={() => setProfileOpen(true)}
              className="w-8 h-8 rounded-full bg-crm-primary flex items-center justify-center text-white text-sm font-medium hover:opacity-80 transition-opacity cursor-pointer"
            >
              {userData?.initials || "SD"}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>

      {/* Profile Sidebar */}
      <Sheet open={profileOpen} onOpenChange={setProfileOpen}>
        <SheetContent 
          side="right" 
          className="border-crm-border w-64 p-0 rounded-lg border-l bg-transparent overflow-hidden" 
          style={{ 
            backgroundColor: 'transparent',
            transition: 'none',
            animation: 'none',
            height: 'auto',
            maxHeight: 'calc(100vh - 2rem)',
            top: '1rem',
            bottom: 'auto',
            right: '20px'
          }}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Profile Menu</SheetTitle>
            <SheetDescription>User profile and account settings</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col rounded-lg bg-crm-surface overflow-hidden h-full" style={{ backgroundColor: 'var(--color-crm-surface)' }}>
            <div className="p-6 pb-0 bg-crm-surface rounded-t-lg" style={{ backgroundColor: 'var(--color-crm-surface)' }}>
              <div className="flex flex-col" style={{ gap: '10px' }}>
                <h3 className="text-lg font-semibold text-crm-text-primary">{userData?.name || "Sevda Danaie"}</h3>
                <p className="text-sm text-crm-text-secondary">{userData?.email || "sevda@company.com"}</p>
              </div>
            </div>

            <Separator className="bg-crm-border" style={{ marginTop: '10px', marginBottom: '10px' }} />

            <div className="flex-1 flex flex-col p-4 pt-0 bg-crm-surface" style={{ backgroundColor: 'var(--color-crm-surface)' }}>
              <div className="space-y-1">
                <Link
                  href="/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-crm-text-secondary hover:bg-crm-surface-elevated hover:text-crm-text-primary transition-colors cursor-pointer"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </Link>
                <Link
                  href="/help"
                  onClick={() => setProfileOpen(false)}
                  className="w-full flex items-center gap-3 text-left px-3 py-2.5 rounded-lg text-crm-text-secondary hover:bg-crm-surface-elevated hover:text-crm-text-primary transition-colors cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Help & Support</span>
                </Link>
                <button
                  className="w-full flex items-center gap-3 text-left px-3 py-2.5 rounded-lg text-crm-text-secondary hover:bg-crm-surface-elevated hover:text-crm-text-primary transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            <div className="p-4 bg-crm-surface rounded-b-lg border-t border-crm-border" style={{ backgroundColor: 'var(--color-crm-surface)' }}>
              <Button
                className="w-full bg-crm-surface-elevated hover:bg-crm-surface-elevated/80 text-blue-500 border border-blue-500 hover:border-blue-600 cursor-pointer"
                onClick={() => toast.info("Upgrade to Pro feature coming soon")}
              >
                <Sparkles className="w-4 h-4 mr-2 text-blue-500" />
                <span className="text-blue-500">Upgrade to Pro</span>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
