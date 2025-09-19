import { AppSidebar } from "@/components/layout/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { DocumentationSystem } from "@/components/docs/documentation-system"

export default function DocsPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader title="Documentation & Notes" />
        <main className="flex-1 p-4 md:p-8 pt-6">
          <DocumentationSystem />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
