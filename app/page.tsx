import { CrmLayout } from "@/components/crm-layout"
import { DashboardStats } from "@/components/dashboard-stats"
import { PipelineOverview } from "@/components/pipeline-overview"
import { TopDeals } from "@/components/top-deals"
import { RevenueTrends } from "@/components/revenue-trends"
import { UpcomingTasks } from "@/components/upcoming-tasks"
import { RecentActivity } from "@/components/recent-activity"
import { QuickActions } from "@/components/quick-actions"
import { Home } from "lucide-react"
import data from "@/data/contacts.json"

export default function DashboardPage() {
  return (
    <CrmLayout>
      <div className="p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
          <div className="flex items-center gap-3">
              <Home className="w-6 h-6 text-white" />
              <h1 className="text-2xl font-semibold text-crm-text-primary">Dashboard</h1>
            </div>
            <p className="text-sm text-crm-text-secondary mt-0.5 ml-9">
              Welcome back, {data.users[0]?.name || "User"}
            </p>
          </div>
        </div>

        {/* KPI Cards */}
        <DashboardStats />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Left Column - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pipeline Overview */}
            <PipelineOverview />

            {/* Top Deals */}
            <TopDeals />

            {/* Revenue Trends */}
            <RevenueTrends />
          </div>

          {/* Right Column - 1 column */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <QuickActions />

            {/* Upcoming Tasks */}
            <UpcomingTasks />

            {/* Recent Activity */}
            <RecentActivity />
          </div>
        </div>
      </div>
    </CrmLayout>
  )
}
