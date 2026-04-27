"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  User, 
  Settings, 
  Globe, 
  Bell, 
  Mic, 
  HelpCircle, 
  LogOut, 
  Sparkles, 
  TrendingUp, 
  MapPin, 
  Building2,
  ChevronRight
} from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function ProfilePage() {
  const avatarImg = PlaceHolderImages.find(img => img.id === 'advisor-avatar');

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 animate-fade-up">
      {/* Profile Header */}
      <Card className="bg-card border-none overflow-hidden amber-glow">
        <div className="h-24 bg-gradient-to-r from-primary/30 to-accent/30" />
        <CardContent className="relative px-8 pb-8 -mt-12">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
            <div className="flex items-end gap-6">
              <Avatar className="w-24 h-24 border-4 border-background rounded-2xl shadow-2xl">
                <AvatarImage src={avatarImg?.imageUrl} />
                <AvatarFallback>RS</AvatarFallback>
              </Avatar>
              <div className="pb-2">
                <h1 className="text-3xl font-headline font-bold">Rahul Sharma</h1>
                <p className="text-muted-foreground flex items-center gap-2">
                  Senior Sales Consultant <span className="text-primary font-bold">#450</span>
                </p>
              </div>
            </div>
            <div className="pb-2">
              <Button className="bg-primary text-primary-foreground font-headline tracking-widest h-11 px-8">EDIT PROFILE</Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-border">
            <div className="flex items-center gap-3">
              <Building2 className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-[10px] uppercase text-muted-foreground">Dealership</p>
                <p className="text-xs font-bold">MotorIntel Elite, Delhi</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-[10px] uppercase text-muted-foreground">City</p>
                <p className="text-xs font-bold">New Delhi</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats and AI Insight Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 grid grid-cols-3 gap-4">
          {[
            { label: "Conv. Rate", value: "24%", icon: TrendingUp },
            { label: "Avg Deal Value", value: "₹2.8M", icon: TrendingUp },
            { label: "Rank", value: "#2", icon: TrendingUp },
          ].map((stat, i) => (
            <Card key={i} className="bg-muted/30 border-none text-center p-6">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">{stat.label}</p>
              <p className="text-2xl font-headline font-bold text-primary">{stat.value}</p>
            </Card>
          ))}
        </div>

        <Card className="bg-accent/10 border-accent/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-headline font-bold uppercase tracking-widest text-accent flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Personal Co-Pilot Tip
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed italic text-foreground/80">
              "Rahul, your Urban Commuter conversions are peaking. Focus on the Adventure SUV segment this week to climb to #1."
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-xs font-headline uppercase tracking-widest text-muted-foreground">Account & Preferences</h2>
          <div className="space-y-2">
            {[
              { label: "Account Settings", icon: Settings },
              { label: "Language Preference", icon: Globe, detail: "English" },
              { label: "Notification Settings", icon: Bell },
            ].map((item, i) => (
              <button key={i} className="w-full flex items-center justify-between p-4 bg-card rounded-xl hover:bg-muted transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.detail && <span className="text-xs text-muted-foreground">{item.detail}</span>}
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </button>
            ))}
            <div className="flex items-center justify-between p-4 bg-card rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <Mic className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold">Voice Recording Consent</span>
              </div>
              <Switch checked />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xs font-headline uppercase tracking-widest text-muted-foreground">Support & System</h2>
          <div className="space-y-2">
            {[
              { label: "Help & Support", icon: HelpCircle },
              { label: "Log Out", icon: LogOut, destructive: true },
            ].map((item, i) => (
              <button key={i} className={cn(
                "w-full flex items-center justify-between p-4 bg-card rounded-xl hover:bg-muted transition-colors",
                item.destructive && "text-destructive"
              )}>
                <div className="flex items-center gap-4">
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", item.destructive ? "bg-destructive/10" : "bg-muted")}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold">{item.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-30" />
              </button>
            ))}
          </div>
          <div className="pt-8 text-center">
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground opacity-30">AURA AI KINETIC VERSION 1.0.42</p>
          </div>
        </div>
      </div>
    </div>
  );
}
