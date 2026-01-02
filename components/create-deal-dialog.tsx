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

const dealSchema = z.object({
  name: z.string().min(1, "Deal name is required"),
  amount: z.number().min(0, "Amount must be positive"),
  stage: z.string().min(1, "Stage is required"),
  probability: z.number().min(0).max(100),
  closeDate: z.string().min(1, "Close date is required"),
  companyId: z.string().optional(),
  contactIds: z.array(z.string()).optional(),
  priority: z.string().optional(),
})

type DealFormValues = z.infer<typeof dealSchema>

interface CreateDealDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  companies: Array<{ id: string; name: string }>
  contacts: Array<{ id: string; firstName: string; lastName: string }>
}

export function CreateDealDialog({
  open,
  onOpenChange,
  companies,
  contacts,
}: CreateDealDialogProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<DealFormValues>({
    resolver: zodResolver(dealSchema),
    defaultValues: {
      name: "",
      amount: 0,
      stage: "Qualified",
      probability: 50,
      closeDate: "",
      companyId: "",
      contactIds: [],
      priority: "medium",
    },
  })

  const onSubmit = async (data: DealFormValues) => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "deal",
          ...data,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to create deal")
      }

      form.reset()
      onOpenChange(false)
      router.refresh()
    } catch (error: any) {
      console.error("Error creating deal:", error)
      const errorMessage = error?.message || "Failed to create deal. Please try again."
      alert(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!bg-crm-surface !border-crm-border max-w-2xl" style={{ backgroundColor: 'var(--color-crm-surface)', opacity: 1 }}>
        <DialogHeader>
          <DialogTitle className="text-crm-text-primary">Create New Deal</DialogTitle>
          <DialogDescription className="text-crm-text-secondary">
            Add a new deal to your pipeline
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-crm-text-secondary">Deal Name *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-crm-bg border-crm-border text-crm-text-primary"
                      placeholder="Enterprise License"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-crm-text-secondary">Amount ($) *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        className="bg-crm-bg border-crm-border text-crm-text-primary"
                        placeholder="50000"
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="probability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-crm-text-secondary">Probability (%) *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min="0"
                        max="100"
                        className="bg-crm-bg border-crm-border text-crm-text-primary"
                        placeholder="50"
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
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
                name="stage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-crm-text-secondary">Stage *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-crm-bg border-crm-border text-crm-text-primary">
                          <SelectValue placeholder="Select stage" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="!bg-crm-surface border-crm-border !opacity-100" style={{ backgroundColor: 'var(--color-crm-surface)', opacity: 1 }}>
                        <SelectItem value="Qualified" className="text-crm-text-primary">
                          Qualified
                        </SelectItem>
                        <SelectItem value="Proposal" className="text-crm-text-primary">
                          Proposal
                        </SelectItem>
                        <SelectItem value="Negotiation" className="text-crm-text-primary">
                          Negotiation
                        </SelectItem>
                        <SelectItem value="Closed Won" className="text-crm-text-primary">
                          Closed Won
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
                    <FormLabel className="text-crm-text-secondary">Priority</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-crm-bg border-crm-border text-crm-text-primary">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="!bg-crm-surface border-crm-border !opacity-100" style={{ backgroundColor: 'var(--color-crm-surface)', opacity: 1 }}>
                        <SelectItem value="low" className="text-crm-text-primary">
                          Low
                        </SelectItem>
                        <SelectItem value="medium" className="text-crm-text-primary">
                          Medium
                        </SelectItem>
                        <SelectItem value="high" className="text-crm-text-primary">
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-crm-bg border-crm-border text-crm-text-primary">
                          <SelectValue placeholder="Select company" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="!bg-crm-surface border-crm-border !opacity-100" style={{ backgroundColor: 'var(--color-crm-surface)', opacity: 1 }}>
                        {companies.map((company) => (
                          <SelectItem
                            key={company.id}
                            value={company.id}
                            className="text-crm-text-primary"
                          >
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
                name="closeDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-crm-text-secondary">Close Date *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="date"
                        className="bg-crm-bg border-crm-border text-crm-text-primary"
                      />
                    </FormControl>
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
                {isSubmitting ? "Creating..." : "Create Deal"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

