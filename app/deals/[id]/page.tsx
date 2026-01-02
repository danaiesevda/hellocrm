import { CrmLayout } from "@/components/crm-layout"
import { DealDetailView } from "@/components/deal-detail-view"

export default async function DealDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <CrmLayout>
      <DealDetailView dealId={id} />
    </CrmLayout>
  )
}

