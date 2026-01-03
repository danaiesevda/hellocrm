"use client"

import { CrmLayout } from "@/components/crm-layout"
import { TicketDetailView } from "@/components/ticket-detail-view"
import { use } from "react"

export default function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  return (
    <CrmLayout>
      <TicketDetailView ticketId={id} />
    </CrmLayout>
  )
}

