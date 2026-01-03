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
import { PhoneInput } from "@/components/phone-input"
import { useRouter } from "next/navigation"

const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  jobTitle: z.string().optional(),
  companyName: z.string().optional(),
  phone: z.string().optional(),
  mobilePhone: z.string().optional(),
  streetAddress: z.string().optional(),
  city: z.string().optional(),
  stateRegion: z.string().optional(),
  postalCode: z.string().optional(),
  leadStatus: z.string().optional(),
  lifecycleStage: z.string().optional(),
  buyingRole: z.string().optional(),
})

type ContactFormValues = z.infer<typeof contactSchema>

interface EditContactDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contact: any
  companies: Array<{ id: string; name: string }>
  onContactUpdated?: () => void
}

export function EditContactDialog({
  open,
  onOpenChange,
  contact,
  companies,
  onContactUpdated,
}: EditContactDialogProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      jobTitle: "",
      companyName: "",
      phone: "",
      mobilePhone: "",
      streetAddress: "",
      city: "",
      stateRegion: "",
      postalCode: "",
      leadStatus: "",
      lifecycleStage: "Lead",
      buyingRole: "",
    },
  })

  // Update form when contact changes
  useEffect(() => {
    if (contact) {
      const company = companies.find((c) => c.id === contact.companyId)
      form.reset({
        firstName: contact.firstName || "",
        lastName: contact.lastName || "",
        email: contact.email || "",
        jobTitle: contact.jobTitle || "",
        companyName: company?.name || "",
        phone: contact.phone || "",
        mobilePhone: contact.mobilePhone || "",
        streetAddress: contact.streetAddress || "",
        city: contact.city || "",
        stateRegion: contact.stateRegion || "",
        postalCode: contact.postalCode || "",
        leadStatus: contact.leadStatus || "",
        lifecycleStage: contact.lifecycleStage || "Lead",
        buyingRole: contact.buyingRole || "",
      })
    }
  }, [contact, companies, form])

  const onSubmit = async (data: ContactFormValues) => {
    if (!contact) return

    setIsSubmitting(true)
    try {
      let companyId = contact.companyId || ""

      // Handle company name if changed
      if (data.companyName && data.companyName.trim()) {
        const existingCompany = companies.find(
          (c) => c.name.toLowerCase() === data.companyName!.trim().toLowerCase()
        )

        if (existingCompany) {
          companyId = existingCompany.id
        } else {
          // Create new company if it doesn't exist
          const companyIdFromName = data.companyName
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "")

          const companyResponse = await fetch("/api/data", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              type: "company",
              id: companyIdFromName,
              name: data.companyName.trim(),
              lifecycleStage: "Lead",
            }),
          })

          if (companyResponse.ok) {
            companyId = companyIdFromName
          }
        }
      }

      const response = await fetch("/api/data", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "contact",
          id: contact.id,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          jobTitle: data.jobTitle || "",
          companyId: companyId,
          phone: data.phone || "",
          mobilePhone: data.mobilePhone || "",
          streetAddress: data.streetAddress || "",
          city: data.city || "",
          stateRegion: data.stateRegion || "",
          postalCode: data.postalCode || "",
          leadStatus: data.leadStatus || "",
          lifecycleStage: data.lifecycleStage || "Lead",
          buyingRole: data.buyingRole || "",
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to update contact")
      }

      toast.success("Contact updated successfully!")
      onOpenChange(false)

      if (onContactUpdated) {
        onContactUpdated()
      } else {
        router.refresh()
      }
    } catch (error: any) {
      console.error("Error updating contact:", error)
      const errorMessage = error?.message || "Failed to update contact. Please try again."
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!contact) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!bg-crm-surface !border-crm-border max-w-2xl max-h-[90vh] overflow-y-auto" style={{ backgroundColor: 'var(--color-crm-surface)', opacity: 1 }}>
        <DialogHeader>
          <DialogTitle className="text-crm-text-primary">Edit Contact</DialogTitle>
          <DialogDescription className="text-crm-text-secondary">
            Update contact information
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-crm-text-secondary">First Name *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-crm-bg border-crm-border text-crm-text-primary"
                        placeholder="John"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-crm-text-secondary">Last Name *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-crm-bg border-crm-border text-crm-text-primary"
                        placeholder="Doe"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-crm-text-secondary">Email *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      className="bg-crm-bg border-crm-border text-crm-text-primary"
                      placeholder="john.doe@company.com"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-crm-text-secondary">Job Title</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-crm-bg border-crm-border text-crm-text-primary"
                        placeholder="VP of Sales"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-crm-text-secondary">Company</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-crm-bg border-crm-border text-crm-text-primary"
                        placeholder="Enter company name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-crm-text-secondary">Phone</FormLabel>
                  <FormControl>
                    <PhoneInput
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="555-0123"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lifecycleStage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-crm-text-secondary">Lifecycle Stage</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-crm-bg border-crm-border text-crm-text-primary">
                        <SelectValue placeholder="Select stage" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="!bg-crm-surface border-crm-border !opacity-100" style={{ backgroundColor: 'var(--color-crm-surface)', opacity: 1 }}>
                      <SelectItem value="Lead" className="text-crm-text-primary">
                        Lead
                      </SelectItem>
                      <SelectItem value="Opportunity" className="text-crm-text-primary">
                        Opportunity
                      </SelectItem>
                      <SelectItem value="Customer" className="text-crm-text-primary">
                        Customer
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                {isSubmitting ? "Updating..." : "Update Contact"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

