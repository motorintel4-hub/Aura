"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  TrendingUp,
  TrendingDown,
  UserPlus,
  Target,
  FileText,
  BarChart3,
  Sparkles,
  ChevronRight,
  Zap,
  BookOpen
} from "lucide-react";
import { useRouter } from "next/navigation";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const router = useRouter();
  const avatarImg = PlaceHolderImages.find(img => img.id === 'advisor-avatar');

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-up">
      {/* App Bar / Header */}
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-headline font-bold flex items-center gap-2">
            Aura Advisor <span className="hidden md:inline">Cockpit</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, Rahul <span className="text-primary animate-pulse">👋</span>
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
          </Button>
          <Avatar className="w-10 h-10 border-2 border-primary">
            <AvatarImage src={avatarImg?.imageUrl} />
            <AvatarFallback>RA</AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Performance Motivation */}
      <Card className="bg-primary/10 border-none">
        <CardContent className="py-4 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">Performance Insight</p>
              <p className="text-xs text-muted-foreground">You're 15% ahead of your daily target. Keep the momentum!</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-primary">
            View Stats
          </Button>
        </CardContent>
      </Card>

      {/* Today's Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Walk-ins", value: "12", delta: "+2", positive: true },
          { label: "Conversions", value: "4", delta: "+1", positive: true },
          { label: "Avg Deal Value", value: "₹2.4M", delta: "-5%", positive: false },
        ].map((stat, i) => (
          <Card key={i} className="bg-card border-border">
            <CardContent className="p-6">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">{stat.label}</p>
              <div className="flex items-end justify-between">
                <p className="text-3xl font-headline font-bold">{stat.value}</p>
                <div className={cn(
                  "flex items-center text-xs font-bold",
                  stat.positive ? "text-accent" : "text-destructive"
                )}>
                  {stat.positive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                  {stat.delta}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Active Session & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-sm font-headline uppercase tracking-widest text-accent flex items-center gap-2">
            <Zap className="w-4 h-4" /> Active Session
          </h2>
          <Card className="bg-card border-none hover:teal-glow transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                <Avatar className="w-16 h-16 rounded-lg border-2 border-accent">
                  <AvatarFallback className="bg-accent/20 text-accent font-bold text-xl">SK</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold">Sameer Khan</h3>
                    <Badge className="bg-destructive hover:bg-destructive/80 text-[10px] uppercase">Hot Lead</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">Interested in <span className="text-foreground font-bold">Adventure SUV</span></p>
                  <Card className="bg-accent/10 border-accent/20">
                    <CardContent className="p-3 flex items-center gap-3">
                      <Sparkles className="w-4 h-4 text-accent" />
                      <p className="text-xs italic">"Highlight the off-road clearance and family safety features next."</p>
                    </CardContent>
                  </Card>
                </div>
                <Button className="w-full md:w-auto bg-primary text-primary-foreground font-headline group" onClick={() => router.push("/discovery")}>
                  RESUME SESSION
                  <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <h2 className="text-sm font-headline uppercase tracking-widest text-muted-foreground">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "New Lead", icon: UserPlus, href: "/discovery" },
              { label: "View Leads", icon: BarChart3, href: "/customers" },
              { label: "Battle Cards", icon: BookOpen, href: "/battle-cards" },
              { label: "Reports", icon: FileText, href: "/profile" },
            ].map((action, i) => (
              <button
                key={i}
                onClick={() => router.push(action.href)}
                className="flex flex-col items-center justify-center p-6 bg-card rounded-xl hover:bg-muted transition-all border border-transparent hover:border-primary/20 group"
              >
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <action.icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-headline font-bold uppercase tracking-widest">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Targets & Leaderboard */}
        <div className="space-y-8">
          <Card className="bg-card border-none">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" /> Monthly Goal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-end mb-4">
                <p className="text-3xl font-headline font-bold">₹12.4M</p>
                <p className="text-xs text-muted-foreground">Target: ₹18M</p>
              </div>
              <Progress value={68} className="h-2 bg-muted" />
              <div className="mt-4 flex justify-between text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                <span>68% Completed</span>
                <span>8 Days Left</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-none">
            <CardHeader>
              <CardTitle className="text-sm">Leaderboard</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "Anand R.", sales: "₹15.2M", rank: 1, current: false },
                { name: "Rahul S.", sales: "₹12.4M", rank: 2, current: true },
                { name: "Priya V.", sales: "₹10.8M", rank: 3, current: false },
              ].map((advisor, i) => (
                <div key={i} className={cn(
                  "flex items-center gap-3 p-3 rounded-lg",
                  advisor.current ? "bg-primary/10 ring-1 ring-primary/30" : "bg-muted/30"
                )}>
                  <div className="w-6 text-xs font-bold text-muted-foreground">#{advisor.rank}</div>
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-[10px]">{advisor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-xs font-bold">{advisor.name}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">{advisor.sales}</p>
                  </div>
                  {advisor.current && <Badge className="bg-primary text-[8px]">YOU</Badge>}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
