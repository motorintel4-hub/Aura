"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, Sparkles } from "lucide-react";

export default function ProfileSetupPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-headline font-bold text-foreground">Profile Setup</h2>
          <Button variant="link" className="text-muted-foreground" onClick={() => router.push("/dashboard")}>
            Skip
          </Button>
        </div>

        <div className="mb-12">
          <p className="text-xs font-headline uppercase tracking-[0.2em] text-accent mb-2">Step 1 of 2</p>
          <h1 className="text-3xl font-headline font-bold text-foreground mb-4">Personal Identity</h1>
          <Progress value={50} className="h-2 bg-muted" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Photo Upload Zone */}
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-muted rounded-xl bg-card/50">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4 cursor-pointer hover:bg-muted/80 transition-colors">
                <Camera className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-sm text-foreground font-medium">Upload Profile Photo</p>
              <p className="text-xs text-muted-foreground mt-1">Recommended square JPG or PNG under 5MB</p>
            </div>

            {/* Input Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">Full Name</Label>
                <Input placeholder="Enter your full name" className="bg-muted border-none h-12" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">Dealership Name</Label>
                <Input placeholder="Enter dealership name" className="bg-muted border-none h-12" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">City</Label>
                <Input placeholder="Enter your city" className="bg-muted border-none h-12" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">Professional Role</Label>
                <Select>
                  <SelectTrigger className="bg-muted border-none h-12">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">Sales Advisor</SelectItem>
                    <SelectItem value="manager">Relationship Manager</SelectItem>
                    <SelectItem value="lead">Sales Lead</SelectItem>
                    <SelectItem value="senior">Senior Consultant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              className="w-full bg-primary text-primary-foreground font-headline h-14 amber-glow"
              onClick={() => router.push("/dashboard")}
            >
              CONTINUE
            </Button>
          </div>

          {/* AI Insights Panel */}
          <div className="lg:col-span-1">
            <Card className="bg-accent/10 border-accent/20 h-full p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-accent" />
                <h3 className="text-sm font-headline font-bold text-accent uppercase tracking-widest">AI Insights</h3>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed">
                Providing a dealership name allows AURA to sync localized market data and performance benchmarks for your specific region.
              </p>
              <div className="mt-8 pt-6 border-t border-accent/20">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  Synchronizing Regional Intelligence...
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
