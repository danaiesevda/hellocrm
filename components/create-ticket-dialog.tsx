"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter } from "next/navigation"

const ticketSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.string().min(1, "Status is required"),
  priority: z.string().min(1, "Priority is required"),
  contactId: z.string().optional(),
  companyId: z.string().optional(),
})

type TicketFormValues = z.infer<typeof ticketSchema>

interface CreateTicketDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contacts: Array<{ id: string; firstName: string; lastName: string }>
  companies: Array<{ id: string; name: string }>
  onTicketCreated?: () => void
}

export function CreateTicketDialog({
  open,
  onOpenChange,
  contacts,
  companies,
  onTicketCreated,
}: CreateTicketDialogProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "New",
      priority: "Medium",
      contactId: undefined,
      companyId: undefined,
    },
  })

  const onSubmit = async (data: TicketFormValues) => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "ticket",
          title: data.title,
          description: data.description || "",
          status: data.status,
          priority: data.priority,
          contactId: data.contactId || "",
          companyId: data.companyId || "",
          assigneeId: "mohammed-ahmadi",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create ticket")
      }

      form.reset()
      onOpenChange(false)

      // Call callback to refresh immediately
      if (onTicketCreated) {
        onTicketCreated()
      } else {
        router.refresh()
      }
    } catch (error) {
      console.error("Error creating ticket:", error)
      alert("Failed to create ticket. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!bg-crm-surface !border-crm-border max-w-2xl max-h-[90vh] overflow-y-auto" style={{ backgroundColor: 'var(--color-crm-surface)', opacity: 1 }}>
        <DialogHeader>
          <DialogTitle className="text-crm-text-primary">Create New Ticket</DialogTitle>
          <DialogDescription className="text-crm-text-secondary">
            Add a new support ticket
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-crm-text-secondary">Title *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-crm-bg border-crm-border text-crm-text-primary"
                      placeholder="Issue title"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-crm-text-secondary">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="bg-crm-bg border-crm-border text-crm-text-primary"
                      placeholder="Describe the issue..."
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-crm-text-secondary">Status *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-crm-bg border-crm-border text-crm-text-primary">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="!bg-crm-surface border-crm-border !opacity-100" style={{ backgroundColor: 'var(--color-crm-surface)', opacity: 1 }}>
                        <SelectItem value="New" className="text-crm-text-primary">
                          New
                        </SelectItem>
                        <SelectItem value="In Progress" className="text-crm-text-primary">
                          In Progress
                        </SelectItem>
                        <SelectItem value="Resolved" className="text-crm-text-primary">
                          Resolved
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-crm-text-secondary">Priority *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-crm-bg border-crm-border text-crm-text-primary">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="!bg-crm-surface border-crm-border !opacity-100" style={{ backgroundColor: 'var(--color-crm-surface)', opacity: 1 }}>
                        <SelectItem value="Low" className="text-crm-text-primary">
                          Low
                        </SelectItem>
                        <SelectItem value="Medium" className="text-crm-text-primary">
                          Medium
                        </SelectItem>
                        <SelectItem value="High" className="text-crm-text-primary">
                          High
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="companyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-crm-text-secondary">Company</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(value || undefined)} 
                      value={field.value || undefined}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-crm-bg border-crm-border text-crm-text-primary">
                          <SelectValue placeholder="Select company" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="!bg-crm-surface border-crm-border !opacity-100" style={{ backgroundColor: 'var(--color-crm-surface)', opacity: 1 }}>
                        {companies.map((company) => (
                          <SelectItem key={company.id} value={company.id} className="text-crm-text-primary">
                            {company.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-crm-text-secondary">Contact</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(value || undefined)} 
                      value={field.value || undefined}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-crm-bg border-crm-border text-crm-text-primary">
                          <SelectValue placeholder="Select contact" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="!bg-crm-surface border-crm-border !opacity-100" style={{ backgroundColor: 'var(--color-crm-surface)', opacity: 1 }}>
                        {contacts.map((contact) => (
                          <SelectItem key={contact.id} value={contact.id} className="text-crm-text-primary">
                            {contact.firstName} {contact.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-crm-border text-crm-text-primary hover:bg-crm-surface-elevated"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-crm-primary hover:bg-crm-primary-hover text-white"
              >
                {isSubmitting ? "Creating..." : "Create Ticket"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

