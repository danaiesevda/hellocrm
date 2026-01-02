import { CrmLayout } from "@/components/crm-layout"
import { TicketDetailView } from "@/components/ticket-detail-view"

export default async function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <CrmLayout>
      <TicketDetailView ticketId={id} />
    </CrmLayout>
  )
}

