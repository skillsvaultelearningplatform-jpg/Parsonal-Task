import { AppSidebar } from "@/components/layout/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { PromptGenerator } from "@/components/prompt/prompt-generator"

export default function PromptPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader title="Prompt Generator" />
        <main className="flex-1 p-4 md:p-8 pt-6">
          <PromptGenerator />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
