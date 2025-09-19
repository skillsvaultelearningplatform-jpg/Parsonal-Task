import { AppSidebar } from "@/components/layout/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { ProjectManager } from "@/components/projects/project-manager"

export default function ProjectsPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader title="Projects & Ideas" />
        <main className="flex-1 p-4 md:p-8 pt-6">
          <ProjectManager />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
