import { AppSidebar } from "@/components/layout/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { TaskManager } from "@/components/tasks/task-manager"

export default function TasksPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader title="Daily Tasks" />
        <main className="flex-1 p-4 md:p-8 pt-6">
          <TaskManager />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
