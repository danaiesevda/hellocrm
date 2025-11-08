import { CrmLayout } from "@/components/crm-layout"
import { ContactDetailView } from "@/components/contact-detail-view"

export default async function ContactDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <CrmLayout>
      <ContactDetailView contactId={id} />
    </CrmLayout>
  )
}
