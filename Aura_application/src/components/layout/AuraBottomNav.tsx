"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Swords,
  User
} from "lucide-react";

const navItems = [
  { label: "Home", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Leads", icon: Users, href: "/customers" },
  { label: "Cards", icon: BookOpen, href: "/battle-cards" },
  { label: "Learn", icon: Swords, href: "/training" },
  { label: "Me", icon: User, href: "/profile" },
];

export default function AuraBottomNav() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border flex items-center justify-around px-2 z-50">
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 w-full h-full rounded-lg transition-all",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            <item.icon className={cn("w-5 h-5", isActive && "animate-pulse")} />
            <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
