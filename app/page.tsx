import { AppSidebar } from "@/components/layout/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { DashboardOverview } from "@/components/dashboard/dashboard-overview"

export default function HomePage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <DashboardOverview />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
