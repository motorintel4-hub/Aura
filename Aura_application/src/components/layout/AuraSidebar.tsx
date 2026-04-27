"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Swords,
  BookOpen,
  User,
  MessageSquareWarning,
  Bell,
  LogOut,
  ChevronRight
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Customers", icon: Users, href: "/customers" },
  { label: "Battle Cards", icon: BookOpen, href: "/battle-cards" },
  { label: "Objection Pilot", icon: MessageSquareWarning, href: "/objection" },
  { label: "Training Hub", icon: Swords, href: "/training" },
  { label: "Profile", icon: User, href: "/profile" },
];

export default function AuraSidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex flex-col h-screen bg-background border-r border-border sticky top-0">
      {/* Branding */}
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-bold text-primary-foreground">A</div>
          <span className="text-xl font-headline font-bold tracking-widest lg:block hidden">AURA AI</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-lg transition-all group",
                isActive
                  ? "bg-primary text-primary-foreground amber-glow"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-primary-foreground" : "group-hover:text-accent")} />
              <span className={cn("font-medium lg:block hidden", isActive && "font-bold")}>
                {item.label}
              </span>
              {isActive && <ChevronRight className="ml-auto w-4 h-4 lg:block hidden" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 mt-auto border-t border-border">
        <button className="flex items-center gap-3 px-3 py-3 w-full rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all">
          <LogOut className="w-5 h-5" />
          <span className="font-medium lg:block hidden">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
