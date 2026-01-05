"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Trash2 } from "lucide-react"

const ticketSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.string().min(1, "Status is required"),
  priority: z.string().min(1, "Priority is required"),
  contactId: z.string().optional(),
  companyId: z.string().optional(),
})

type TicketFormValues = z.infer<typeof ticketSchema>

interface EditTicketDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ticket: any
  contacts: Array<{ id: string; firstName: string; lastName: string }>
  companies: Array<{ id: string; name: string }>
  onTicketUpdated?: () => void
}

export function EditTicketDialog({
  open,
  onOpenChange,
  ticket,
  contacts,
  companies,
  onTicketUpdated,
}: EditTicketDialogProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

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

  useEffect(() => {
    if (ticket) {
      form.reset({
        title: ticket.title || "",
        description: ticket.description || "",
        status: ticket.status || "New",
        priority: ticket.priority || "Medium",
        contactId: ticket.contactId || undefined,
        companyId: ticket.companyId || undefined,
      })
    }
  }, [ticket, form])

  const onSubmit = async (data: TicketFormValues) => {
    if (!ticket) return

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/data", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "ticket",
          id: ticket.id,
          title: data.title,
          description: data.description || "",
          status: data.status,
          priority: data.priority,
          contactId: data.contactId || "",
          companyId: data.companyId || "",
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to update ticket")
      }

      toast.success("Ticket updated successfully!")
      onOpenChange(false)

      if (onTicketUpdated) {
        onTicketUpdated()
      } else {
        router.refresh()
      }
    } catch (error: any) {
      console.error("Error updating ticket:", error)
      const errorMessage = error?.message || "Failed to update ticket. Please try again."
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!ticket) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/data?type=ticket&id=${ticket.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to delete ticket")
      }

      toast.success("Ticket deleted successfully!")
      setShowDeleteDialog(false)
      onOpenChange(false)

      // Redirect to tickets list
      router.push("/tickets")
    } catch (error: any) {
      console.error("Error deleting ticket:", error)
      const errorMessage = error?.message || "Failed to delete ticket. Please try again."
      toast.error(errorMessage)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!bg-crm-surface !border-crm-border max-w-2xl max-h-[90vh] overflow-y-auto" style={{ backgroundColor: 'var(--color-crm-surface)', opacity: 1 }}>
        <DialogHeader>
          <DialogTitle className="text-crm-text-primary">Edit Ticket</DialogTitle>
          <DialogDescription className="text-crm-text-secondary">
            Update ticket information
          </DialogDescription>
        </DialogHeader>
        {!ticket ? (
          <div className="py-8 text-center text-crm-text-secondary">Loading ticket...</div>
        ) : (

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
                    <Select onValueChange={field.onChange} value={field.value}>
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
                    <Select onValueChange={field.onChange} value={field.value}>
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
                onClick={() => setShowDeleteDialog(true)}
                disabled={isSubmitting || isDeleting}
                className="border-red-500/50 text-red-500 hover:bg-red-500/10 hover:border-red-500"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
              <div className="flex-1" />
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
                disabled={isSubmitting || isDeleting}
                className="bg-crm-primary hover:bg-crm-primary-hover text-white"
              >
                {isSubmitting ? "Updating..." : "Update Ticket"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
        )}
      </DialogContent>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="!bg-crm-surface !border-crm-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-crm-text-primary">Delete Ticket</AlertDialogTitle>
            <AlertDialogDescription className="text-crm-text-secondary">
              Are you sure you want to delete "{ticket?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-crm-border text-crm-text-primary hover:bg-crm-surface-elevated">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  )
}

