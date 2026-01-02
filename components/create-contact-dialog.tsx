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
import { Label } from "@/components/ui/label"
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

interface CreateContactDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  companies: Array<{ id: string; name: string }>
  onContactCreated?: () => void
}

export function CreateContactDialog({
  open,
  onOpenChange,
  companies,
  onContactCreated,
}: CreateContactDialogProps) {
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

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true)
    try {
      let companyId = ""

      // Check if company name is provided
      if (data.companyName && data.companyName.trim()) {
        // Check if company already exists (case-insensitive)
        const existingCompany = companies.find(
          (c) => c.name.toLowerCase() === data.companyName!.trim().toLowerCase()
        )

        if (existingCompany) {
          // Use existing company
          companyId = existingCompany.id
        } else {
          // Create new company
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

          if (!companyResponse.ok) {
            throw new Error("Failed to create company")
          }

          companyId = companyIdFromName
        }
      }

      const response = await fetch("/api/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "contact",
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
        throw new Error(errorData.error || "Failed to create contact")
      }

      // Reset form and close dialog
      form.reset()
      onOpenChange(false)

      // Call callback to refresh immediately
      if (onContactCreated) {
        onContactCreated()
      } else {
        router.refresh()
      }
    } catch (error: any) {
      console.error("Error creating contact:", error)
      const errorMessage = error?.message || "Failed to create contact. Please try again."
      alert(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!bg-crm-surface !border-crm-border max-w-2xl max-h-[90vh] overflow-y-auto" style={{ backgroundColor: 'var(--color-crm-surface)', opacity: 1 }}>
        <DialogHeader>
          <DialogTitle className="text-crm-text-primary">Create New Contact</DialogTitle>
          <DialogDescription className="text-crm-text-secondary">
            Add a new contact to your CRM
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                {isSubmitting ? "Creating..." : "Create Contact"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

