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
import { useRouter } from "next/navigation"

const companySchema = z.object({
  name: z.string().min(1, "Company name is required"),
  domain: z.string().optional(),
  phone: z.string().optional(),
  industry: z.string().optional(),
  employees: z.string().optional(),
  revenue: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  lifecycleStage: z.string().optional(),
  isPrimary: z.boolean().optional(),
})

type CompanyFormValues = z.infer<typeof companySchema>

interface EditCompanyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  company: any
  onCompanyUpdated?: () => void
}

export function EditCompanyDialog({
  open,
  onOpenChange,
  company,
  onCompanyUpdated,
}: EditCompanyDialogProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
      domain: "",
      phone: "",
      industry: "",
      employees: "",
      revenue: "",
      address: "",
      city: "",
      country: "",
      lifecycleStage: "Lead",
      isPrimary: false,
    },
  })

  useEffect(() => {
    if (company) {
      form.reset({
        name: company.name || "",
        domain: company.domain || "",
        phone: company.phone || "",
        industry: company.industry || "",
        employees: company.employees || "",
        revenue: company.revenue || "",
        address: company.address || "",
        city: company.city || "",
        country: company.country || "",
        lifecycleStage: company.lifecycleStage || "Lead",
        isPrimary: company.isPrimary || false,
      })
    }
  }, [company, form])

  const onSubmit = async (data: CompanyFormValues) => {
    if (!company || !company.id) {
      toast.error("Company information is missing. Please refresh the page.")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/data", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "company",
          id: company.id,
          name: data.name.trim(),
          domain: data.domain?.trim() || "",
          phone: data.phone?.trim() || "",
          industry: data.industry?.trim() || "",
          employees: data.employees?.trim() || "",
          revenue: data.revenue?.trim() || "",
          address: data.address?.trim() || "",
          city: data.city?.trim() || "",
          country: data.country?.trim() || "",
          lifecycleStage: data.lifecycleStage || "Lead",
          isPrimary: data.isPrimary || false,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error || `Failed to update company: ${response.status} ${response.statusText}`
        // Don't log to console.error to avoid showing console errors to users
        throw new Error(errorMessage)
      }

      toast.success("Company updated successfully!")
      form.reset()
      onOpenChange(false)
      
      if (onCompanyUpdated) {
        onCompanyUpdated()
      } else {
        router.refresh()
      }
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to update company. Please try again."
      // Only log to console in development, not as an error
      if (process.env.NODE_ENV === 'development') {
        console.warn("Company update failed:", errorMessage)
      }
      toast.error(errorMessage)
      // Don't close dialog on error so user can try again
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!company) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!bg-crm-surface !border-crm-border max-w-2xl max-h-[90vh] overflow-y-auto" style={{ backgroundColor: 'var(--color-crm-surface)', opacity: 1 }}>
        <DialogHeader>
          <DialogTitle className="text-crm-text-primary">Edit Company</DialogTitle>
          <DialogDescription className="text-crm-text-secondary">
            Update company information
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-crm-text-secondary">Company Name *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-crm-bg border-crm-border text-crm-text-primary"
                      placeholder="Acme Corporation"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="domain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-crm-text-secondary">Domain</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-crm-bg border-crm-border text-crm-text-primary"
                        placeholder="acme.com"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-crm-text-secondary">Phone</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-crm-bg border-crm-border text-crm-text-primary"
                        placeholder="+1 555-0100"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-crm-text-secondary">Industry</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-crm-bg border-crm-border text-crm-text-primary"
                        placeholder="Technology"
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
                        <SelectItem value="Customer" className="text-crm-text-primary">
                          Customer
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
                name="employees"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-crm-text-secondary">Employees</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-crm-bg border-crm-border text-crm-text-primary"
                        placeholder="1000"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="revenue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-crm-text-secondary">Revenue</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-crm-bg border-crm-border text-crm-text-primary"
                        placeholder="$10M"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-crm-text-secondary">City</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-crm-bg border-crm-border text-crm-text-primary"
                        placeholder="San Francisco"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-crm-text-secondary">Country</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-crm-bg border-crm-border text-crm-text-primary"
                        placeholder="United States"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-crm-text-secondary">Address</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-crm-bg border-crm-border text-crm-text-primary"
                      placeholder="123 Main Street"
                    />
                  </FormControl>
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
                {isSubmitting ? "Updating..." : "Update Company"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

