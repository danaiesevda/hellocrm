"use client"

import { CrmLayout } from "@/components/crm-layout"
import { CompanyDetailView } from "@/components/company-detail-view"
import { use } from "react"

export default function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  return (
    <CrmLayout>
      <CompanyDetailView companyId={id} />
    </CrmLayout>
  )
}

