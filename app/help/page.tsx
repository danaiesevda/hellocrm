import { CrmLayout } from "@/components/crm-layout"
import { HelpCircle, Mail, MessageCircle, Book, Video, FileText, ChevronRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function HelpPage() {
  const faqs = [
    {
      question: "How do I create a new contact?",
      answer: "Click on the Contacts menu item in the sidebar, then click the '+ Create Contact' button. Fill in the contact information and click 'Create Contact'."
    },
    {
      question: "How do I add a deal?",
      answer: "Navigate to the Deals page and click '+ Create Deal'. Enter the deal details including name, amount, stage, and associated company."
    },
    {
      question: "Can I export my data?",
      answer: "Yes, you can export all your data by going to Settings > Data Management > Export All Data. This will download a JSON file with all your CRM data."
    },
    {
      question: "How do I search for contacts or companies?",
      answer: "Use the search bar at the top of the page. You can press Cmd+K (Mac) or Ctrl+K (Windows) to quickly open the search. Type the name, email, or other details to find what you're looking for."
    },
    {
      question: "How do I edit contact information?",
      answer: "Navigate to the contact's detail page by clicking on their name, then click the 'Edit' button at the top right. Make your changes and click 'Save Changes'."
    },
    {
      question: "What are tickets used for?",
      answer: "Tickets help you track support requests, issues, or tasks. Create a ticket to assign it to team members and track its status through resolution."
    }
  ]

  const resources = [
    {
      title: "Documentation",
      description: "Comprehensive guides and tutorials",
      icon: Book,
      href: "#"
    },
    {
      title: "Video Tutorials",
      description: "Step-by-step video guides",
      icon: Video,
      href: "#"
    },
    {
      title: "API Reference",
      description: "Developer documentation",
      icon: FileText,
      href: "#"
    }
  ]

  return (
    <CrmLayout>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <HelpCircle className="w-6 h-6 text-crm-primary" />
          <h1 className="text-2xl font-semibold text-crm-text-primary">Help & Support</h1>
        </div>

        <div className="max-w-4xl space-y-6">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-crm-surface border-crm-border p-6 hover:bg-crm-surface-elevated transition-colors cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-crm-primary/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-crm-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-crm-text-primary mb-1">Email Support</h3>
                  <p className="text-sm text-crm-text-secondary mb-3">
                    Get help via email. We typically respond within 24 hours.
                  </p>
                  <a 
                    href="mailto:support@hellocrm.com" 
                    className="text-sm text-crm-primary hover:underline cursor-pointer"
                  >
                    support@hellocrm.com
                  </a>
                </div>
              </div>
            </Card>

              <Card className="bg-crm-surface border-crm-border p-6 hover:bg-crm-surface-elevated transition-colors cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-crm-success/20 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-5 h-5 text-crm-success" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-crm-text-primary mb-1">Live Chat</h3>
                    <p className="text-sm text-crm-text-secondary mb-3">
                      Chat with our support team in real-time.
                    </p>
                    <Button
                      variant="outline"
                      className="border-crm-border text-crm-text-primary hover:bg-crm-surface-elevated bg-transparent cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Start Chat
                    </Button>
                  </div>
                </div>
              </Card>
          </div>

          {/* Frequently Asked Questions */}
          <Card className="bg-crm-surface border-crm-border p-6">
            <div className="flex items-center gap-3 mb-6">
              <HelpCircle className="w-5 h-5 text-crm-primary" />
              <h2 className="text-lg font-semibold text-crm-text-primary">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index}>
                  <div className="mb-2">
                    <h3 className="text-sm font-semibold text-crm-text-primary mb-1">
                      {faq.question}
                    </h3>
                    <p className="text-sm text-crm-text-secondary">
                      {faq.answer}
                    </p>
                  </div>
                  {index < faqs.length - 1 && <Separator className="bg-crm-border mt-4" />}
                </div>
              ))}
            </div>
          </Card>

          {/* Resources */}
          <Card className="bg-crm-surface border-crm-border p-6">
            <div className="flex items-center gap-3 mb-6">
              <Book className="w-5 h-5 text-crm-primary" />
              <h2 className="text-lg font-semibold text-crm-text-primary">Resources</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {resources.map((resource, index) => {
                const Icon = resource.icon
                return (
                  <a
                    key={index}
                    href={resource.href}
                    className="p-4 rounded-lg border border-crm-border bg-crm-surface hover:bg-crm-surface-elevated transition-colors cursor-pointer group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-crm-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-crm-primary/30 transition-colors">
                        <Icon className="w-4 h-4 text-crm-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-crm-text-primary mb-1 group-hover:text-crm-primary transition-colors">
                          {resource.title}
                        </h3>
                        <p className="text-xs text-crm-text-secondary">
                          {resource.description}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-crm-text-tertiary group-hover:text-crm-primary transition-colors flex-shrink-0" />
                    </div>
                  </a>
                )
              })}
            </div>
          </Card>

          {/* Contact Information */}
          <Card className="bg-crm-surface border-crm-border p-6">
            <h2 className="text-lg font-semibold text-crm-text-primary mb-4">Still need help?</h2>
            <p className="text-sm text-crm-text-secondary mb-4">
              Our support team is here to help you get the most out of HelloCRM. Don't hesitate to reach out!
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                className="border-crm-border text-crm-text-primary hover:bg-crm-surface-elevated bg-transparent cursor-pointer"
              >
                <Mail className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
              <Button
                variant="outline"
                className="border-crm-border text-crm-text-primary hover:bg-crm-surface-elevated bg-transparent cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Request Feature
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </CrmLayout>
  )
}

