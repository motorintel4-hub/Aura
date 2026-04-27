"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, Award, Calendar, BookOpen, Swords, BarChart3, ChevronRight, Zap } from "lucide-react";

export default function TrainingHubPage() {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-up">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">Kinetic Training</h1>
          <p className="text-muted-foreground">Upgrade your sales intelligence.</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-[10px] uppercase text-muted-foreground mb-1">Monthly Completion</p>
            <p className="text-xl font-headline font-bold text-accent">85%</p>
          </div>
          <Progress value={85} className="w-32 h-2 bg-muted" />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          <section className="space-y-4">
            <h2 className="text-sm font-headline uppercase tracking-widest text-primary flex items-center gap-2">
              <PlayCircle className="w-4 h-4" /> Active Course
            </h2>
            <Card className="bg-card border-none overflow-hidden hover:amber-glow transition-all duration-300">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 bg-muted relative h-48 md:h-auto">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Zap className="w-12 h-12 text-primary opacity-20" />
                  </div>
                </div>
                <CardContent className="p-8 flex-1 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge className="bg-accent/20 text-accent border-none text-[8px] mb-2 uppercase">Core Sales</Badge>
                      <h3 className="text-2xl font-headline font-bold leading-tight">Closing Techniques for High-Value Leads</h3>
                    </div>
                    <span className="text-xs font-bold text-primary">60% Done</span>
                  </div>
                  <Progress value={60} className="h-1 bg-muted" />
                  <div className="flex items-center gap-6 text-xs text-muted-foreground pt-4">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Due in 2 days</span>
                    <span className="flex items-center gap-1"><Award className="w-3 h-3" /> 50 Points</span>
                  </div>
                  <Button className="w-full bg-primary text-primary-foreground font-headline h-12">RESUME TRAINING</Button>
                </CardContent>
              </div>
            </Card>
          </section>

          <section className="space-y-4">
            <h2 className="text-sm font-headline uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Live Sessions
            </h2>
            <Card className="bg-accent/5 border-accent/20">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-accent/20 flex flex-col items-center justify-center">
                    <span className="text-[10px] font-bold uppercase">Oct</span>
                    <span className="text-lg font-headline font-bold">28</span>
                  </div>
                  <div>
                    <h4 className="font-bold">Grand Touring Variant Strategy</h4>
                    <p className="text-xs text-muted-foreground">Live demo with Product Specialist Rajesh • 4:00 PM</p>
                  </div>
                </div>
                <Button variant="outline" className="text-accent border-accent/30 hover:bg-accent hover:text-white transition-all group">
                  JOIN NOW <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </section>

          <section className="space-y-4">
            <h2 className="text-sm font-headline uppercase tracking-widest text-muted-foreground">Soft Skills Academy</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {[
                { title: "Empathetic Listening", time: "12m", views: "1.2k" },
                { title: "Negotiation Tactics", time: "15m", views: "800" },
                { title: "Mirroring Basics", time: "10m", views: "2k" },
                { title: "Body Language", time: "18m", views: "1.5k" },
              ].map((skill, i) => (
                <Card key={i} className="min-w-[200px] bg-card border-none shrink-0 group cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardContent className="p-4 space-y-3">
                    <div className="w-full h-24 bg-muted rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <PlayCircle className="w-8 h-8 text-muted-foreground group-hover:text-primary" />
                    </div>
                    <p className="text-sm font-bold leading-tight">{skill.title}</p>
                    <div className="flex justify-between text-[10px] text-muted-foreground font-bold uppercase">
                      <span>{skill.time}</span>
                      <span>{skill.views} Views</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Tools & Insights */}
        <div className="space-y-8">
          <Card className="bg-card border-none">
            <CardHeader>
              <CardTitle className="text-sm">Learning Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-accent/5 rounded-xl border border-accent/10 space-y-4">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-accent" />
                  <p className="text-xs font-bold text-accent uppercase tracking-widest">Co-Pilot Insight</p>
                </div>
                <p className="text-sm leading-relaxed italic text-foreground/80">
                  "Your conversion rate is lagging in 'MotorIntel Urban Commuter' pitches. Focus on mastering the 'Emotional Pitch' level for this model."
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h2 className="text-sm font-headline uppercase tracking-widest text-muted-foreground">Tools</h2>
            {[
              { label: "My Scorecards", icon: BarChart3, action: "View Report" },
              { label: "Mock Simulations", icon: Swords, action: "Launch Sim" },
              { label: "Battle Card Library", icon: BookOpen, action: "Access Library" },
            ].map((tool, i) => (
              <Card key={i} className="bg-card border-none hover:bg-muted/50 transition-colors">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <tool.icon className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-sm">{tool.label}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-primary text-[10px] font-bold uppercase tracking-widest">{tool.action}</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
