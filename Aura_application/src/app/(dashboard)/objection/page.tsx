"use client"

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, MessageSquareWarning, ChevronRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const OBJECTIONS = [
  { id: "price", label: "Price Too High", strategy: "Value Re-anchoring", steps: [
    { tactic: "Empathetic Validation", script: "I understand that budget is a key priority. Many of our customers initially feel the same about the upfront cost..." },
    { tactic: "Value Pivot", script: "However, when you factor in the 5-year free maintenance and class-leading resale value, the Total Cost of Ownership is actually lower than competitors." }
  ]},
  { id: "competitor", label: "Competitor Better", strategy: "Differentiation Pivot", steps: [
    { tactic: "Acknowledge Choice", script: "The competition is strong this year. It's great that you've done your research..." },
    { tactic: "Kinetic Edge", script: "What sets us apart is the Kinetic AI Cockpit which our rivals simply don't have. It actively helps you drive safer." }
  ]},
  { id: "wait", label: "Waiting Period", strategy: "Urgency/Priority Lock", steps: [
    { tactic: "Supply Context", script: "High demand is a testament to the vehicle's quality. We are prioritizing our verified leads..." },
    { tactic: "Priority Slot", script: "If we complete the documentation today, I can lock in your priority slot for the next batch arriving in 15 days." }
  ]},
  { id: "mileage", label: "Mileage Concern", strategy: "Efficiency Evidence", steps: [
    { tactic: "Real-world Data", script: "On paper it's one thing, but in actual city traffic, our Mild-Hybrid system performs remarkably well..." },
    { tactic: "Eco-Mode Demo", script: "Let's look at the trip computer from our test-drive model; it's averaging 16kmpl in peak hour traffic." }
  ]},
];

export default function ObjectionCoPilotPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = OBJECTIONS.find(o => o.id === selectedId);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-up">
      <header>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-headline font-bold">Objection Co-Pilot</h1>
          <Badge variant="outline" className="text-accent border-accent/30 text-[10px]">
            <Sparkles className="w-3 h-3 mr-1" /> AI INTELLIGENCE
          </Badge>
        </div>
        <p className="text-muted-foreground max-w-2xl">
          Select the core concern raised by the customer so AURA can generate a high-conversion response strategy.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Categories */}
        <div className="space-y-4">
          <h2 className="text-xs font-headline uppercase tracking-widest text-muted-foreground mb-4">Select Category</h2>
          {OBJECTIONS.map((obj) => (
            <button
              key={obj.id}
              onClick={() => setSelectedId(obj.id)}
              className={cn(
                "w-full p-6 rounded-xl border-2 text-left transition-all relative overflow-hidden group",
                selectedId === obj.id
                  ? "border-primary bg-primary/10 amber-glow"
                  : "border-border bg-card hover:border-accent/30"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-headline font-bold uppercase tracking-widest">{obj.label}</span>
                <ChevronRight className={cn(
                  "w-5 h-5 transition-transform",
                  selectedId === obj.id ? "rotate-90 text-primary" : "text-muted-foreground"
                )} />
              </div>
            </button>
          ))}
          <button className="w-full p-6 rounded-xl border-2 border-dashed border-border hover:border-accent transition-all text-center">
            <span className="text-xs font-headline uppercase tracking-widest text-muted-foreground">+ Custom Objection</span>
          </button>
        </div>

        {/* Right Column: Strategy Output */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="space-y-6 animate-fade-up">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-headline font-bold flex items-center gap-2">
                  <Zap className="w-5 h-5 text-accent" /> Recommended Strategy: <span className="text-accent">{selected.strategy}</span>
                </h2>
              </div>

              <div className="space-y-6">
                {selected.steps.map((step, i) => (
                  <Card key={i} className="bg-card border-none overflow-hidden">
                    <div className="flex">
                      <div className="w-12 bg-accent/20 flex flex-col items-center justify-center font-headline font-bold text-accent">
                        {i + 1}
                      </div>
                      <CardContent className="p-6 flex-1">
                        <div className="mb-4">
                          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Tactic</p>
                          <p className="text-sm font-bold text-accent uppercase tracking-wider">{step.tactic}</p>
                        </div>
                        <div className="p-4 bg-muted/40 rounded-lg italic text-sm leading-relaxed border-l-2 border-primary">
                          "{step.script}"
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="flex gap-4 pt-6">
                <Button className="flex-1 bg-accent text-accent-foreground font-headline h-14 hover:teal-glow">
                  <CheckCircle2 className="mr-2 w-5 h-5" /> MARK RESOLVED
                </Button>
                <Button variant="outline" className="flex-1 h-14 font-headline uppercase tracking-widest border-border">
                  LOG AS LOST
                </Button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 bg-muted/20 rounded-2xl border border-dashed border-border text-center">
              <MessageSquareWarning className="w-16 h-16 text-muted-foreground/30 mb-6" />
              <h3 className="text-xl font-headline font-bold text-muted-foreground">Select an objection to reveal strategy</h3>
              <p className="text-sm text-muted-foreground/60 max-w-sm mt-2">AURA will analyze current market data and inventory to provide the optimal response.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
