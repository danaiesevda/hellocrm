import { CrmLayout } from "@/components/crm-layout"
import { CompanyDetailView } from "@/components/company-detail-view"
import { Suspense } from "react"

export default async function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <CrmLayout>
      <Suspense fallback={<div className="p-6 text-crm-text-secondary">Loading...</div>}>
        <CompanyDetailView companyId={id} />
      </Suspense>
    </CrmLayout>
  )
}

