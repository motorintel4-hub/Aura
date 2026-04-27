"use client"

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  ChevronLeft, 
  Phone, 
  MessageCircle, 
  Edit3, 
  Sparkles, 
  History, 
  FileText, 
  TrendingUp, 
  Shield, 
  Zap,
  MapPin,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-background animate-fade-up">
      {/* Header Profile Strip */}
      <div className="bg-card border-b border-border p-4 md:p-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 items-start md:items-center">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ChevronLeft className="w-6 h-6" />
          </Button>
          
          <div className="flex-1 flex gap-6 items-center">
            <Avatar className="w-20 h-20 rounded-2xl border-2 border-primary shadow-2xl">
              <AvatarFallback className="text-2xl font-bold bg-muted">SK</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-headline font-bold">Sameer Khan</h1>
                <Badge className="bg-destructive text-[10px] uppercase font-bold tracking-widest">Hot Lead</Badge>
              </div>
              <p className="text-muted-foreground flex items-center gap-2">
                <Phone className="w-3 h-3" /> +91 98765 43210
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button size="icon" className="bg-accent rounded-xl hover:teal-glow"><Phone className="w-5 h-5" /></Button>
            <Button size="icon" className="bg-[#25D366] text-white rounded-xl"><MessageCircle className="w-5 h-5" /></Button>
            <Button variant="outline" className="border-border rounded-xl">Edit</Button>
          </div>
        </div>
      </div>

      {/* Tabs & Main Content Area */}
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <Tabs defaultValue="overview" className="space-y-8" onValueChange={setActiveTab}>
          <TabsList className="bg-card p-1 border-none justify-start w-full overflow-x-auto no-scrollbar">
            <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-headline text-[10px] tracking-widest uppercase">Overview</TabsTrigger>
            <TabsTrigger value="insights" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-headline text-[10px] tracking-widest uppercase">6P Insights</TabsTrigger>
            <TabsTrigger value="journey" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-headline text-[10px] tracking-widest uppercase">Journey</TabsTrigger>
            <TabsTrigger value="notes" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-headline text-[10px] tracking-widest uppercase">Notes</TabsTrigger>
          </TabsList>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <TabsContent value="overview" className="space-y-8 mt-0">
                {/* AI Insight Card */}
                <Card className="bg-accent/10 border-accent/20">
                  <CardHeader>
                    <CardTitle className="text-sm font-headline font-bold uppercase tracking-widest text-accent flex items-center gap-2">
                      <Sparkles className="w-4 h-4" /> Detected Persona: Urban Family Buyer
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-foreground/80">
                      Sameer values safety and cabin space above all else. He is looking for a long-term family vehicle that can handle both daily commutes and occasional long-distance weekend trips.
                    </p>
                  </CardContent>
                </Card>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-card border-none">
                    <CardHeader><CardTitle className="text-xs font-headline uppercase tracking-widest text-muted-foreground">Vehicle Interest</CardTitle></CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        <p className="font-bold">Adventure SUV</p>
                        <Badge variant="outline" className="text-[8px] border-primary/20 text-primary">Top Spec (Z+)</Badge>
                      </div>
                      <div className="flex gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-800 border border-white/20" />
                        <span className="text-xs text-muted-foreground">Midnight Black Metallic</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card border-none">
                    <CardHeader><CardTitle className="text-xs font-headline uppercase tracking-widest text-muted-foreground">Lead Stage</CardTitle></CardHeader>
                    <CardContent>
                      <Badge className="bg-primary/20 text-primary border-none font-bold uppercase tracking-widest px-4 py-2">Negotiation</Badge>
                      <p className="text-[10px] text-muted-foreground mt-2 uppercase tracking-widest">Last updated 2h ago</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Decision Matrix */}
                <Card className="bg-card border-none">
                  <CardHeader><CardTitle className="text-sm">Decision Matrix</CardTitle></CardHeader>
                  <CardContent className="space-y-6">
                    {[
                      { label: "Safety", value: 90 },
                      { label: "Price", value: 65 },
                      { label: "Space", value: 85 },
                      { label: "Brand", value: 40 },
                    ].map((m) => (
                      <div key={m.label} className="space-y-2">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="uppercase tracking-widest">{m.label}</span>
                          <span>{m.value}/100</span>
                        </div>
                        <Progress value={m.value} className="h-1 bg-muted" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="insights" className="space-y-8 mt-0">
                <h2 className="text-xl font-headline font-bold">Strategic Insight — 6P Profile</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { p: "Purpose", val: "Primary vehicle for 5-person family adventures.", icon: Zap },
                    { p: "People", val: "Influenced by spouse; prioritizing kid safety.", icon: History },
                    { p: "Pattern", val: "1200km monthly; mixed city and highway.", icon: TrendingUp },
                    { p: "Preferences", val: "ADAS features, high ground clearance.", icon: Shield },
                    { p: "Price", val: "Flexible between ₹25L - ₹30L; Financing pre-approved.", icon: FileText },
                    { p: "Purchase Context", val: "Urgent; current vehicle sold already.", icon: Calendar },
                  ].map((p, i) => (
                    <div key={i} className="p-6 bg-card rounded-xl border-l-4 border-primary/20 hover:border-primary transition-all">
                      <div className="flex items-center gap-3 mb-2">
                        <p.icon className="w-4 h-4 text-primary" />
                        <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary">{p.p}</p>
                      </div>
                      <p className="text-sm text-foreground/80 leading-relaxed">{p.val}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="journey" className="space-y-6 mt-0">
                <div className="relative pl-8 space-y-12 before:content-[''] before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-muted">
                  {[
                    { title: "Price Negotiation", time: "Today, 10:30 AM", type: "Negotiation", insight: "Customer mentioned competitor wait time is lower." },
                    { title: "Test Drive Completed", time: "Yesterday, 2:15 PM", type: "Experience", insight: "Positive reaction to ADAS Lane Keep Assist." },
                    { title: "Initial Walk-in", time: "Oct 24, 11:00 AM", type: "Walk-in", insight: "Determined 'Urban Family' persona quickly." },
                  ].map((step, i) => (
                    <div key={i} className="relative group">
                      <div className="absolute -left-8 top-1 w-6 h-6 rounded-full bg-muted border-4 border-background group-hover:bg-primary transition-colors" />
                      <Card className="bg-card border-none hover:bg-muted/30 transition-all">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="font-bold text-lg">{step.title}</h4>
                              <p className="text-xs text-muted-foreground">{step.time}</p>
                            </div>
                            <Badge variant="outline" className="uppercase text-[8px] tracking-widest">{step.type}</Badge>
                          </div>
                          <div className="p-3 bg-accent/5 border-l-2 border-accent rounded-lg flex items-center gap-3">
                            <Sparkles className="w-4 h-4 text-accent" />
                            <p className="text-xs italic text-accent">{step.insight}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </div>

            {/* Sticky AI Co-Pilot Panel */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="bg-accent/10 border-accent/20 sticky top-8">
                <CardHeader>
                  <CardTitle className="text-sm font-headline font-bold uppercase tracking-widest text-accent flex items-center gap-2">
                    <Zap className="w-4 h-4" /> AI Co-Pilot Recommendation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <p className="text-[10px] uppercase text-muted-foreground mb-4">Recommended Vehicle</p>
                    <div className="p-4 bg-background/50 rounded-xl border border-white/5 space-y-3">
                      <p className="text-lg font-bold">MotorIntel Adventure SUV</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-primary text-primary-foreground text-[8px]">92% MATCH</Badge>
                        <Badge variant="secondary" className="text-[8px] bg-muted">ADAS</Badge>
                        <Badge variant="secondary" className="text-[8px] bg-muted">7-SEATER</Badge>
                      </div>
                      <Button variant="link" className="p-0 text-accent text-xs h-auto uppercase tracking-widest font-bold">View Battle Card</Button>
                    </div>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-accent/20">
                    <p className="text-[10px] uppercase text-muted-foreground">Next Action</p>
                    <div className="p-4 bg-primary/10 rounded-xl space-y-2">
                      <p className="text-xs font-bold uppercase text-primary">Schedule Priority Handover</p>
                      <p className="text-xs text-muted-foreground">Customer is urgent. Proposing a 7-day priority delivery will likely close the deal.</p>
                    </div>
                    <Button className="w-full bg-primary text-primary-foreground font-headline amber-glow">SCHEDULE DELIVERY</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
