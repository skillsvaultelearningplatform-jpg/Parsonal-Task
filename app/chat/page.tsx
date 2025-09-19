import { AppSidebar } from "@/components/layout/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { ChatInterface } from "@/components/chat/chat-interface"

export default function ChatPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader title="AI Chat & Voice" />
        <main className="flex-1 p-4 md:p-8 pt-6">
          <ChatInterface />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
