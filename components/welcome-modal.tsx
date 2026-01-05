"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Sparkles, Rocket, Code, Zap } from "lucide-react"

export function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Show welcome modal every time the website opens
    // Small delay to ensure smooth animation
    setTimeout(() => {
      setIsOpen(true)
    }, 300)
  }, [])

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent 
        className="!bg-crm-surface !border-crm-border max-w-2xl p-8 text-center"
        showCloseButton={false}
      >
        <DialogHeader className="space-y-6 items-center text-center">
          {/* Animated Icons */}
          <div className="flex justify-center gap-6 mb-6">
            <div className="animate-float" style={{ animationDelay: "0s" }}>
              <Rocket className="w-14 h-14 text-crm-primary" />
            </div>
            <div className="animate-float" style={{ animationDelay: "0.5s" }}>
              <Code className="w-14 h-14 text-crm-primary" />
            </div>
            <div className="animate-float" style={{ animationDelay: "1s" }}>
              <Zap className="w-14 h-14 text-crm-primary" />
            </div>
            <div className="animate-float" style={{ animationDelay: "1.5s" }}>
              <Sparkles className="w-14 h-14 text-crm-primary" />
            </div>
          </div>

          {/* Title with fade-in animation */}
          <DialogTitle className="text-3xl font-bold text-crm-text-primary animate-fade-in text-center px-4">
            A SaaS CRM I planned, managed, built, and shipped. No slides were harmed in the process :)
          </DialogTitle>

          {/* Description with slide-up animation */}
          <DialogDescription className="text-base text-crm-text-secondary leading-relaxed animate-slide-up text-center max-w-xl mx-auto px-4 pt-2">
            From discovery and roadmapping to execution and launch, I owned the full product journey. This project shows how I work as a PM: structured when needed, flexible when reality hits, and always focused on getting a real product live.
          </DialogDescription>

          {/* Button with scale animation */}
          <div className="flex justify-center pt-6">
            <Button
              onClick={handleClose}
              className="bg-crm-primary hover:bg-crm-primary-hover text-white px-10 py-6 text-lg font-semibold animate-scale-in-bounce cursor-pointer shadow-lg hover:shadow-xl transition-all relative"
            >
              <Sparkles className="w-5 h-5 mr-2 animate-pulse-glow" />
              Play Around
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

