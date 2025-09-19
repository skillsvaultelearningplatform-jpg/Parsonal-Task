import { AppSidebar } from "@/components/layout/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { MusicPlayer } from "@/components/music/music-player"

export default function MusicPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader title="Music Player" />
        <main className="flex-1 p-4 md:p-8 pt-6">
          <MusicPlayer />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
