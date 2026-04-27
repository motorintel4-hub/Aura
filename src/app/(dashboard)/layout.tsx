"use client"

import AuraSidebar from "@/components/layout/AuraSidebar";
import AuraBottomNav from "@/components/layout/AuraBottomNav";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar for Desktop/Tablet */}
      <AuraSidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        <ScrollArea className="flex-1">
          <div className="pb-20 md:pb-0">
            {children}
          </div>
        </ScrollArea>

        {/* Bottom Nav for Mobile */}
        <AuraBottomNav />
      </main>
    </div>
  );
}
