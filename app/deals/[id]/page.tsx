"use client"

import { CrmLayout } from "@/components/crm-layout"
import { DealDetailView } from "@/components/deal-detail-view"
import { use } from "react"

export default function DealDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  return (
    <CrmLayout>
      <DealDetailView dealId={id} />
    </CrmLayout>
  )
}

